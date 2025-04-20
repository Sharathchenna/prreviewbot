# gitea_tools.py
import os
import requests
import logging # Import logging

# --- Configuration ---
# Set up basic logging if not already done elsewhere
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Define Secret Paths ---
GITEA_API_TOKEN_PATH = "/etc/gitea-api-token/secret"

# --- Helper function to read secrets from files ---
def read_secret_from_file(path):
    """Reads a secret from a file path if it exists, otherwise returns None."""
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f: # Specify encoding
                secret_value = f.read().strip()
                logging.info(f"Successfully read secret from {path}")
                return secret_value
        except IOError as e:
            logging.error(f"Could not read secret from {path}: {e}")
            return None
    else:
        # Log only if we expect the file sometimes (e.g., in Cloud Run)
        # Avoid logging this constantly during local dev if the path doesn't exist
        # logging.debug(f"Secret file not found at {path}. Will check environment variables.")
        pass
    return None

# --- Load Configuration ---
# Try reading from mounted file first (for Cloud Run), fallback to Env Var (for local)
GITEA_API_TOKEN = read_secret_from_file(GITEA_API_TOKEN_PATH) or os.environ.get('GITEA_API_TOKEN')

# Gitea URL still comes directly from environment variable (not a secret)
GITEA_URL = os.environ.get('GITEA_URL') # e.g., https://gitea.yourdomain.com

# --- Validate Configuration ---
if not GITEA_API_TOKEN:
    logging.error("CRITICAL: GITEA_API_TOKEN is not configured (checked file path and environment variable).")
    # Depending on your error strategy, you might raise an exception here
    # raise ValueError("GITEA_API_TOKEN must be set")
if not GITEA_URL:
    logging.error("CRITICAL: GITEA_URL environment variable is not configured.")
    # raise ValueError("GITEA_URL must be set")


# --- Gitea API Functions ---
def get_gitea_pr_diff(repo_full_name: str, pr_index: int) -> str | None:
    """Fetches the diff content for a Gitea Pull Request."""
    # Check again inside function in case loading failed silently
    if not GITEA_URL or not GITEA_API_TOKEN:
        logging.error("GITEA_URL or GITEA_API_TOKEN not available in get_gitea_pr_diff.")
        return None

    # Ensure repo_full_name is owner/repo format
    if '/' not in repo_full_name:
         logging.error(f"Invalid repo_full_name format: {repo_full_name}")
         return None

    diff_url = f"{GITEA_URL}/api/v1/repos/{repo_full_name}/pulls/{pr_index}.diff"
    headers = {'Authorization': f'token {GITEA_API_TOKEN}'} # Use the loaded token

    try:
        logging.info(f"Fetching diff from {diff_url}")
        response = requests.get(diff_url, headers=headers, timeout=30)
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        logging.info(f"Diff fetched successfully (Status: {response.status_code})")
        return response.text
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to fetch Gitea PR diff for {repo_full_name} PR #{pr_index}: {e}")
        return None

def post_gitea_comment(repo_full_name: str, pr_index: int, comment_body: str) -> bool:
    """Posts a comment to a Gitea Pull Request."""
    # Check again inside function
    if not GITEA_URL or not GITEA_API_TOKEN:
        logging.error("GITEA_URL or GITEA_API_TOKEN not available in post_gitea_comment.")
        return False

    # Ensure repo_full_name is owner/repo format
    if '/' not in repo_full_name:
         logging.error(f"Invalid repo_full_name format: {repo_full_name}")
         return False

    # Note: PRs are often treated as issues for commenting
    comment_url = f"{GITEA_URL}/api/v1/repos/{repo_full_name}/issues/{pr_index}/comments"
    headers = {
        'Authorization': f'token {GITEA_API_TOKEN}', # Use the loaded token
        'Content-Type': 'application/json'
    }
    payload = {'body': comment_body}

    try:
        logging.info(f"Posting comment to PR #{pr_index} in {repo_full_name}")
        response = requests.post(comment_url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        logging.info(f"Comment posted successfully (Status: {response.status_code})")
        return True
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to post Gitea comment for {repo_full_name} PR #{pr_index}: {e}")
        if hasattr(e, 'response') and e.response is not None:
             logging.error(f"Gitea API Response: {e.response.status_code} - {e.response.text[:500]}...") # Log part of response
        return False