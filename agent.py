# --- agent.py ---
import logging
from google.adk.agents import LlmAgent

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def create_review_agent():
    """Creates the Gitea PR Review Agent configured for Flutter/Dart."""
    logging.info("Creating Flutter review agent instance...")

    # --- MODIFIED INSTRUCTION ---
    # Removed the {diff_content} placeholder.
    # Instruct the agent to find the diff within the user message.
    review_instruction = """
    You are an AI code reviewer specialized in analyzing Flutter/Dart code.
    The user has provided a Git diff below in their message. Your goal is to identify potential issues
    and suggest improvements based on Flutter and Dart best practices found within that diff.

    Focus on:
    1.  **Dart Language & Style:** Check for adherence to Effective Dart guidelines (e.g., proper naming conventions, use of `final`/`const`, null safety handling `?` `!`, type annotations). Check for common Dart lint rule violations (like those in `flutter_lints` or `lints`).
    2.  **Flutter Widget Usage:** Look for correct widget lifecycle management (e.g., `initState`, `dispose`), proper use of `BuildContext`, avoiding unnecessary widget rebuilds (e.g., misuse of `setState`), potential performance issues (e.g., large build methods, lack of `const` constructors where applicable).
    3.  **State Management:** Analyze the use of state management (e.g., `setState`, Provider, Riverpod, BLoC). Check for potential issues like memory leaks (not disposing controllers/streams), improper state updates, or overly complex state logic discernible from the diff.
    4.  **Asynchronous Code:** Examine `async`/`await` usage, `Future` and `Stream` handling. Look for unhandled errors in async operations or potential race conditions.
    5.  **Error Handling:** Check for adequate `try`/`catch` blocks, especially around API calls or potentially failing operations.
    6.  **Readability & Maintainability:** Suggest improvements for code clarity, widget composition (breaking down large widgets), removing commented-out code, and adding necessary comments for complex logic.
    7.  **Potential Bugs:** Look for common logical errors, off-by-one errors, issues with list/map manipulation, incorrect conditional logic.
    8.  **Security:** Check for basic security anti-patterns like hardcoded API keys or sensitive information.

    Analyze the diff provided in the user's message and provide your feedback as a concise, bulleted list of potential issues or suggestions relevant to Flutter/Dart development.
    If no significant issues are found, state 'No major Flutter/Dart issues identified in this analysis.'
    Be constructive and specific in your feedback. Start your response with "AI Flutter/Dart Code Review Analysis:".
    """
    # --- END MODIFIED INSTRUCTION ---

    try:
        model_name = "gemini-2.5-flash-preview-04-17" # Keep using the preview model for now
        logging.info(f"Configuring agent with model: {model_name}")

        reviewer_agent = LlmAgent(
            name="FlutterCodeReviewer",
            model=model_name,
            instruction=review_instruction, # Use the modified instruction
            description="Analyzes Gitea PR diffs for Flutter/Dart code provided in the user message.",
        )
        logging.info("Flutter review agent instance created successfully.")
        return reviewer_agent
    except Exception as e:
        logging.error(f"Failed to create ADK LlmAgent: {e}", exc_info=True)
        raise