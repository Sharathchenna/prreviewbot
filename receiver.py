# receiver.py
import os
import hmac
import hashlib
import json
import logging

from fastapi import FastAPI, Request, Header, HTTPException, Response, status

# --- Configuration ---
# Set up basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Import Application Logic ---
try:
    from agent_runner import run_analysis
    from gitea_tools import get_gitea_pr_diff, post_gitea_comment # Gitea API token loaded here
except ImportError as e:
    logging.error(f"Failed to import required modules: {e}. Ensure agent_runner.py and gitea_tools.py are accessible.")
    raise

# --- Define Secret Paths ---
GITEA_WEBHOOK_SECRET_PATH = "/etc/gitea-webhook-secret/secret"

# --- Re-use or define Helper function to read secrets ---
# (You could put this in a shared utils.py and import it in both files)
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
        # logging.debug(f"Secret file not found at {path}. Will check environment variables.")
        pass
    return None

# --- Load Webhook Secret ---
# Try reading from mounted file first (for Cloud Run), fallback to Env Var (for local)
GITEA_WEBHOOK_SECRET = read_secret_from_file(GITEA_WEBHOOK_SECRET_PATH) or os.environ.get('GITEA_WEBHOOK_SECRET')

if not GITEA_WEBHOOK_SECRET:
    logging.warning("GITEA_WEBHOOK_SECRET is not configured (checked file path and environment variable). Webhook signature verification will be skipped.")
    # If verification MUST happen, raise an error instead:
    # raise ValueError("GITEA_WEBHOOK_SECRET must be set for signature verification")

# --- FastAPI Application Setup ---
app = FastAPI(
    title="Gitea PR Review Agent Receiver",
    description="Receives Gitea webhooks, triggers ADK agent analysis, and posts results.",
    version="1.0.0"
)

# --- Webhook Endpoint ---
@app.post(
    '/webhook',
    status_code=status.HTTP_202_ACCEPTED,
    summary="Handles Gitea Pull Request Webhooks",
    tags=["Webhooks"]
)
async def handle_webhook(request: Request, x_gitea_signature: str | None = Header(None, alias="X-Gitea-Signature")):
    """
    Receives and processes incoming webhooks from Gitea.
    Verifies the signature, checks for relevant pull request events,
    fetches the PR diff, triggers AI analysis via ADK agent,
    and posts the analysis results back as a comment on the PR.
    """
    # 1. Verify Signature (Security Check)
    raw_body = await request.body()
    if GITEA_WEBHOOK_SECRET: # Only verify if secret is loaded
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
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid signature'
            )
        else:
            logging.info("Webhook signature verified successfully.")
    else:
        logging.warning("Skipping webhook signature verification (no secret configured).")

    # 2. Parse Payload
    try:
        payload = await request.json()
    except json.JSONDecodeError:
        logging.error("Invalid JSON payload received.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Invalid JSON payload'
        )

    # 3. Check Event Type and Extract Data
    action = payload.get('action')
    is_pull_request = 'pull_request' in payload
    logging.info(f"Received webhook event. Action: {action}, Is PR: {is_pull_request}")

    if is_pull_request and action in ['opened', 'synchronize']:
        # ... (rest of the logic inside this block remains the same as before) ...
        # It will call the functions from gitea_tools which now load secrets correctly.

        pr_data = payload.get('pull_request', {})
        repo_data = payload.get('repository', {})
        pr_number = payload.get('number')
        pr_url = pr_data.get('html_url', 'N/A')
        repo_full_name = repo_data.get('full_name')

        if not pr_number or not repo_full_name:
             logging.error(f"Missing PR number ({pr_number}) or repository name ({repo_full_name}) in payload.")
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Missing PR number or repository name')

        logging.info(f"Processing PR #{pr_number} ('{action}') for repo '{repo_full_name}' - URL: {pr_url}")

        # 4. Get PR diff
        logging.info(f"Attempting to fetch diff for PR #{pr_number}...")
        diff_content = get_gitea_pr_diff(repo_full_name, pr_number)

        if diff_content is None:
            logging.error(f"Could not retrieve PR diff for PR #{pr_number}. Aborting analysis.")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Failed to retrieve PR diff for #{pr_number}')

        if not diff_content.strip():
             logging.info(f"PR #{pr_number} diff is empty. Skipping analysis.")
             return Response(
                 content=json.dumps({'status': 'empty diff skipped', 'pr_number': pr_number}),
                 status_code=status.HTTP_200_OK,
                 media_type='application/json'
             )

        # 5. Call ADK agent
        logging.info(f"Invoking ADK agent for PR #{pr_number}...")
        analysis_result = run_analysis(diff_content)

        # 6. Post comment back to Gitea
        if analysis_result:
            logging.info(f"Agent analysis complete for PR #{pr_number}. Posting comment...")
            comment_to_post = f"{analysis_result}\n\n---\n*AI analysis powered by Google ADK & Gemini*"
            success = post_gitea_comment(repo_full_name, pr_number, comment_to_post)
            if not success:
                logging.error(f"Failed to post analysis comment to Gitea for PR #{pr_number}.")
                return {'status': 'analysis done, comment failed', 'pr_number': pr_number}
            else:
                 logging.info(f"Successfully posted comment for PR #{pr_number}.")
        else:
             logging.warning(f"ADK Agent did not return an analysis result for PR #{pr_number}.")
             return {'status': 'analysis done, no result to post', 'pr_number': pr_number}

        logging.info(f"Successfully processed webhook for PR #{pr_number}.")
        return {'status': 'processing complete', 'pr_number': pr_number}

    else:
        # Ignore other events or actions peacefully
        logging.info(f"Ignoring event (action: {action}, is_pr: {is_pull_request})")
        return Response(
             content=json.dumps({'status': 'event ignored'}),
             status_code=status.HTTP_200_OK,
             media_type='application/json'
        )


# --- Health Check Endpoint ---
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check():
    """Basic health check endpoint."""
    return {"status": "ok"}