# Gitea Pull Request AI Review Agent & Website

![PRReviewBot](https://img.shields.io/badge/PRReviewBot-AI%20Powered-blueviolet) ![Status](https://img.shields.io/badge/Status-Active-success)

This project consists of two main components:
1.  **AI Agent Backend**: A Python/FastAPI service that listens for Gitea webhooks, analyzes pull requests using Google's Gemini models, and posts review comments.
2.  **Product Website**: A premium, Linear-style landing page built with Next.js to showcase the bot's features.

---

## 📂 Project Structure

- **`/` (Root)**: Contains the Python backend code (`receiver.py`, `agent_runner.py`, etc.).
- **`/prreviewbot`**: Contains the Next.js website source code.

---

## 🤖 Part 1: AI Agent Backend

The backend implements a webhook receiver that listens for Gitea pull request events (`opened`, `synchronize`), fetches the PR diff, uses a Google ADK agent (powered by Gemini) to analyze the code changes (specifically targeting Flutter/Dart), and posts the review comments back to the Gitea pull request.

### Features

*   Receives Gitea webhooks for pull request events.
*   Verifies webhook signatures for security.
*   Fetches PR diff content from the Gitea API.
*   Invokes a Google ADK agent with a specialized prompt for Flutter/Dart code review.
*   Posts the AI-generated review as a comment on the Gitea PR.
*   Built with FastAPI for the web server.
*   Designed for deployment on Google Cloud Run.

### Setup & Configuration

#### 1. Environment Variables
The following environment variables are required:
*   `GITEA_URL`: The base URL of your Gitea instance.
*   `GITEA_API_TOKEN`: A Gitea API token with permissions to read repositories and post comments.
*   `GITEA_WEBHOOK_SECRET`: The secret key configured for your Gitea webhook.
*   `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud service account key file (if running locally).

#### 2. Running Locally (Python)

1.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Server:**
    ```bash
    uvicorn receiver:app --host 0.0.0.0 --port 8080 --reload
    ```

3.  **Expose to Internet (for Webhooks):**
    Use `ngrok` to expose your local server:
    ```bash
    ngrok http 8080
    ```
    Use the generated URL in your Gitea Webhook settings.

#### 3. Deployment (Google Cloud Run)
Refer to the `Dockerfile` and standard `gcloud run deploy` commands to deploy this service. Ensure secrets are mounted correctly as described in the code.

---

## 🌐 Part 2: Product Website

The project includes a modern, high-performance landing page built with Next.js 15 and Tailwind CSS.

### Features
*   **Linear-style Design**: Dark mode, glassmorphism, and subtle glow effects.
*   **Responsive**: Fully optimized for mobile and desktop.
*   **Bento Grid Layout**: Showcase features in a modern grid.
*   **Tech Stack**: Next.js 15, React 19, Tailwind CSS v4, Lucide Icons.

### Running the Website Locally

1.  **Navigate to the website directory:**
    ```bash
    cd prreviewbot
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    # or
    bun run dev
    ```

4.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

---

## Gitea Webhook Configuration

1.  Go to your Gitea repository settings -> Webhooks.
2.  Click "Add Webhook" -> Gitea.
3.  **Target URL:** Enter the URL of your deployed Python service (e.g., `https://your-cloud-run-url/webhook`).
4.  **Secret:** Enter the configured `GITEA_WEBHOOK_SECRET`.
5.  **Trigger On:** Pull Request (Opened, Synchronized).

---
&copy; 2025 PRReviewBot. All rights reserved.
