# Gitea Pull Request AI Review Agent

This project implements a webhook receiver that listens for Gitea pull request events (`opened`, `synchronize`), fetches the PR diff, uses a Google ADK agent (powered by Gemini) to analyze the code changes (specifically targeting Flutter/Dart), and posts the review comments back to the Gitea pull request.

## Features

*   Receives Gitea webhooks for pull request events.
*   Verifies webhook signatures for security (optional but recommended).
*   Fetches PR diff content from the Gitea API.
*   Invokes a Google ADK agent with a specialized prompt for Flutter/Dart code review.
*   Posts the AI-generated review as a comment on the Gitea PR.
*   Built with FastAPI for the web server.
*   Designed for deployment on Google Cloud Run (or similar serverless platforms).

## Setup

### 1. Environment Variables

The following environment variables are required:

*   `GITEA_URL`: The base URL of your Gitea instance (e.g., `https://gitea.yourdomain.com`).
*   `GITEA_API_TOKEN`: A Gitea API token with permissions to read repositories and post comments. **(Can also be provided via secret file)**
*   `GITEA_WEBHOOK_SECRET`: The secret key configured for your Gitea webhook. **(Can also be provided via secret file)**
*   `GOOGLE_APPLICATION_CREDENTIALS`: (If running outside Google Cloud with ADC) Path to your Google Cloud service account key file.

### 2. Secrets Management (Cloud Run Recommended)

For deployment on Cloud Run, it's highly recommended to mount secrets as files rather than using environment variables for sensitive data like API tokens and webhook secrets.

*   Mount the Gitea API token at `/etc/gitea-api-token/secret`.
*   Mount the Gitea Webhook secret at `/etc/gitea-webhook-secret/secret`.

The application is configured to read from these file paths first and fall back to environment variables if the files don't exist (useful for local development).

### 3. Python Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

## Running Locally

1.  **Set Environment Variables:**
    ```bash
    export GITEA_URL="https://your-gitea-instance.com"
    export GITEA_API_TOKEN="your_gitea_api_token"
    export GITEA_WEBHOOK_SECRET="your_webhook_secret"
    # Optional: Set GOOGLE_APPLICATION_CREDENTIALS if needed
    # export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
    ```

2.  **Run the FastAPI server using Uvicorn:**
    ```bash
    # Make sure you are in the project root directory
    # Use a default port like 8080 for local testing
    uvicorn receiver:app --host 0.0.0.0 --port 8080 --reload
    ```
    The `--reload` flag automatically restarts the server when code changes are detected.

3.  **Expose Localhost (Optional):**
    To receive webhooks from your Gitea instance, you'll need to expose your local server to the internet. Tools like `ngrok` can be used for this:
    ```bash
    ngrok http 8080
    ```
    Use the public URL provided by `ngrok` when configuring the Gitea webhook.

## Deployment (Google Cloud Run)

1.  **Build the Docker Image:**
    ```bash
    gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/gitea-pr-agent
    ```
    Replace `YOUR_PROJECT_ID` with your Google Cloud project ID.

2.  **Deploy to Cloud Run:**
    ```bash
    gcloud run deploy gitea-pr-agent \
        --image gcr.io/YOUR_PROJECT_ID/gitea-pr-agent \
        --platform managed \
        --region YOUR_REGION \
        --allow-unauthenticated \
        --set-env-vars="GITEA_URL=https://your-gitea-instance.com" \
        --update-secrets=/etc/gitea-api-token/secret=gitea-api-token:latest \
        --update-secrets=/etc/gitea-webhook-secret/secret=gitea-webhook-secret:latest \
        --service-account=YOUR_SERVICE_ACCOUNT_EMAIL # Optional: If needed for Vertex AI access
    ```
    *   Replace `YOUR_PROJECT_ID`, `YOUR_REGION`, and `YOUR_SERVICE_ACCOUNT_EMAIL`.
    *   Ensure you have created secrets named `gitea-api-token` and `gitea-webhook-secret` in Google Secret Manager.
    *   `--allow-unauthenticated` is used here for simplicity as signature verification handles security. Adjust if needed.

3.  **Get the Cloud Run Service URL:**
    Note the URL provided after deployment (e.g., `https://gitea-pr-agent-xxxx-uc.a.run.app`).

## Gitea Webhook Configuration

1.  Go to your Gitea repository settings -> Webhooks.
2.  Click "Add Webhook" -> Gitea.
3.  **Target URL:** Enter the URL of your deployed service (Cloud Run URL or ngrok URL for local testing) followed by `/webhook`. Example: `https://gitea-pr-agent-xxxx-uc.a.run.app/webhook`
4.  **HTTP Method:** POST
5.  **POST Content Type:** application/json
6.  **Secret:** Enter the same secret you configured via `GITEA_WEBHOOK_SECRET` or the mounted secret file.
7.  **Trigger On:** Select "Custom events..."
8.  Check the boxes for:
    *   `Pull Request` (Opened)
    *   `Pull Request` (Synchronized)
9.  Ensure the webhook is "Active".
10. Save the webhook.

Now, when you open or update a pull request in the configured Gitea repository, the webhook should trigger the agent, and you should see a comment posted back with the AI review analysis.
