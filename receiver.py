# receiver.py
import os
import hmac
import hashlib
import json
import logging
import time # Added for timing logs

from fastapi import FastAPI, Request, Header, HTTPException, Response, status, BackgroundTasks # Added BackgroundTasks

# --- Configuration ---
# Set up basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Import Application Logic ---
# Assuming agent_runner.py and gitea_tools.py are in the same directory
# or accessible via PYTHONPATH. Handle potential import errors.
try:
    from agent_runner import run_analysis
    from gitea_tools import get_gitea_pr_diff, post_gitea_comment # Gitea API token loaded here
except ImportError as e:
    logging.error(f"Failed to import required modules: {e}. Ensure agent_runner.py and gitea_tools.py are accessible.")
    # In a real scenario, proper error handling or exiting might be needed
    raise

# --- Define Secret Paths ---
# Define paths for secrets mounted in Cloud Run
GITEA_WEBHOOK_SECRET_PATH = "/etc/gitea-webhook-secret/secret" # Matches the last working deploy command

# --- Helper function to read secrets from files ---
def read_secret_from_file(path):
    """Reads a secret from a file path if it exists, otherwise returns None."""
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                secret_value = f.read().strip()
                logging.info(f"Successfully read secret from {path}")
                return secret_value
        except IOError as e:
            logging.error(f"Could not read secret from {path}: {e}")
            return None
    else:
        # This path won't exist locally unless manually created for testing
        # logging.debug(f"Secret file not found at {path}. Will check environment variables.")
        pass
    return None

# --- Load Webhook Secret ---
# Try reading from mounted file first (for Cloud Run), fallback to Env Var (for local)
GITEA_WEBHOOK_SECRET = read_secret_from_file(GITEA_WEBHOOK_SECRET_PATH) or os.environ.get('GITEA_WEBHOOK_SECRET')

if not GITEA_WEBHOOK_SECRET:
    logging.warning("GITEA_WEBHOOK_SECRET is not configured (checked file path and environment variable). Webhook signature verification will be skipped.")
    # If verification MUST happen, you might want to raise an error here instead
    # raise ValueError("GITEA_WEBHOOK_SECRET must be set for signature verification")

# --- FastAPI Application Setup ---
app = FastAPI(
    title="Gitea PR Review Agent Receiver (Async)",
    description="Receives Gitea webhooks, triggers ADK agent analysis in the background, and posts results.",
    version="1.1.0" # Bump version for change
)

# --- Background Task Function ---
def process_pr_review(repo_full_name: str, pr_number: int):
    """
    Performs the actual PR analysis and commenting in a background task.
    NOTE: This runs synchronously within the background task runner.
          If the underlying calls were async, this function could be async too.
    """
    start_task_time = time.monotonic()
    logging.info(f"[BackgroundTask] Starting processing for PR #{pr_number} in repo '{repo_full_name}'")

    # 1. Get PR diff from Gitea API
    start_diff_time = time.monotonic()
    diff_content = get_gitea_pr_diff(repo_full_name, pr_number)
    diff_fetch_duration = time.monotonic() - start_diff_time
    logging.info(f"[BackgroundTask] PR #{pr_number}: Diff fetch took {diff_fetch_duration:.2f} seconds.")

    if diff_content is None:
        logging.error(f"[BackgroundTask] Failed to get valid diff for PR #{pr_number}. Ending task.")
        return # Exit background task
    if not diff_content.strip():
        logging.info(f"[BackgroundTask] PR #{pr_number} diff is empty. Ending task.")
        return # Exit background task

    # 2. Call ADK agent for analysis
    start_agent_time = time.monotonic()
    analysis_result = run_analysis(diff_content)
    agent_duration = time.monotonic() - start_agent_time
    logging.info(f"[BackgroundTask] PR #{pr_number}: Agent analysis took {agent_duration:.2f} seconds.")

    # 3. Post comment back to Gitea
    if analysis_result:
        logging.info(f"[BackgroundTask] Agent analysis complete for PR #{pr_number}. Posting comment...")
        comment_to_post = f"{analysis_result}\n\n---\n*AI analysis powered by Google ADK & Gemini*"
        start_comment_time = time.monotonic()
        success = post_gitea_comment(repo_full_name, pr_number, comment_to_post)
        comment_duration = time.monotonic() - start_comment_time
        logging.info(f"[BackgroundTask] PR #{pr_number}: Comment post took {comment_duration:.2f} seconds.")

        if not success:
            logging.error(f"[BackgroundTask] Failed to post analysis comment to Gitea for PR #{pr_number}.")
        else:
            logging.info(f"[BackgroundTask] Successfully posted comment for PR #{pr_number}.")
    else:
        logging.warning(f"[BackgroundTask] Agent did not return an analysis result for PR #{pr_number}.")

    total_task_duration = time.monotonic() - start_task_time
    logging.info(f"[BackgroundTask] Finished processing for PR #{pr_number}. Total task time: {total_task_duration:.2f} seconds.")


# --- Webhook Endpoint ---
@app.post(
    '/webhook',
    status_code=status.HTTP_202_ACCEPTED, # Respond quickly with 202 Accepted
    summary="Handles Gitea Pull Request Webhooks Asynchronously",
    tags=["Webhooks"]
)
async def handle_webhook(
    request: Request,
    background_tasks: BackgroundTasks, # FastAPI injects this
    x_gitea_signature: str | None = Header(None, alias="X-Gitea-Signature")
):
    """
    Receives Gitea webhooks, verifies signature (if configured),
    queues the actual processing (diff fetch, analysis, comment)
    to run in the background, and returns an immediate 202 Accepted response.
    """
    webhook_received_time = time.monotonic()
    logging.info("Webhook received. Verifying signature...")
    # 1. Verify Signature
    raw_body = await request.body()
    if GITEA_WEBHOOK_SECRET:
        if not x_gitea_signature:
            logging.warning("Request received without X-Gitea-Signature header.")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Missing X-Gitea-Signature header'
            )
        mac = hmac.new(GITEA_WEBHOOK_SECRET.encode('utf-8'), raw_body, hashlib.sha256)
        expected_signature = mac.hexdigest()
        if not hmac.compare_digest(expected_signature, x_gitea_signature):
            logging.error("Invalid webhook signature received.")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid signature')
        logging.info("Webhook signature verified successfully.")
    else:
        logging.warning("Skipping webhook signature verification (no secret configured).")

    # 2. Parse Payload
    try:
        payload = await request.json()
    except json.JSONDecodeError:
        logging.error("Invalid JSON payload received.")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid JSON payload')

    # 3. Check Event Type and Extract Data
    action = payload.get('action')
    is_pull_request = 'pull_request' in payload
    logging.info(f"Webhook event details - Action: {action}, Is PR: {is_pull_request}")

    if is_pull_request and action in ['opened', 'synchronize']:
        pr_data = payload.get('pull_request', {})
        repo_data = payload.get('repository', {})
        pr_number = payload.get('number')
        repo_full_name = repo_data.get('full_name')

        if not pr_number or not repo_full_name:
             logging.error(f"Missing PR number ({pr_number}) or repository name ({repo_full_name}) in payload.")
             # Return 400 Bad Request immediately
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing PR number or repository name')

        logging.info(f"Relevant PR event for PR #{pr_number} in repo '{repo_full_name}'. Scheduling background task.")

        # --- Schedule Background Task ---
        # Add the long-running task to FastAPI's background runner
        background_tasks.add_task(process_pr_review, repo_full_name, pr_number)

        # --- Return Immediate Response ---
        response_time = time.monotonic() - webhook_received_time
        logging.info(f"Returning 202 Accepted for PR #{pr_number} after {response_time:.2f} seconds.")
        return {'status': 'webhook accepted for background processing', 'pr_number': pr_number}

    else:
        # Ignore other events peacefully
        logging.info(f"Ignoring event (action: {action}, is_pr: {is_pull_request})")
        return Response(
             content=json.dumps({'status': 'event ignored'}),
             status_code=status.HTTP_200_OK, # Explicitly 200 OK for ignored events
             media_type='application/json'
        )


# --- Health Check Endpoint (Optional but Recommended) ---
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check():
    """Basic health check endpoint."""
    return {"status": "ok"}

# --- Running the server ---
# Remove any if __name__ == '__main__': block
# Running is handled by Uvicorn/Gunicorn specified in the Dockerfile CMD