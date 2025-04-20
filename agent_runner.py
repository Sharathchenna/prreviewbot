# --- agent_runner.py ---

# Import google.adk maybe optional now depending on usage,
# but keeping it doesn't hurt if other ADK utilities might be used later.
import google.adk as adk
import logging
import time
from agent import create_review_agent # Import the function that creates our agent instance

# --- Configuration ---
# Set up basic logging to match the level used in other files
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def run_analysis(diff_content: str) -> str:
    """
    Creates the ADK agent, invokes it synchronously with the provided diff content,
    and returns the analysis result or an error message.
    """
    logging.info("Attempting to create ADK agent instance...")
    try:
        # Create a new agent instance for each analysis
        # (Depending on ADK internals, this might be inefficient if agent creation is heavy,
        # but ensures isolation for now. Consider creating agent once if possible/safe).
        agent = create_review_agent()
        if not agent: # Add check in case creation returns None unexpectedly
             raise ValueError("create_review_agent returned None")
        logging.info("ADK agent instance created.")
    except Exception as e:
         # Catch errors during agent creation itself
         logging.error(f"Failed during agent creation: {e}", exc_info=True)
         return "Error: Failed to initialize AI code review agent."

    # Prepare the input data for the agent based on the instruction's placeholders
    agent_input = {"diff_content": diff_content}

    logging.info(f"Invoking ADK agent '{agent.name}' for code review...")
    start_time = time.monotonic()
    try:
        # --- Execute the agent ---
        # Use the agent's own .run() method for synchronous execution
        result = agent.run(data=agent_input)
        # --- End Agent Execution ---

        run_duration = time.monotonic() - start_time

        # Process the result (adapt based on actual ADK result object structure)
        # It's good practice to check if the expected output attribute exists
        if hasattr(result, 'output') and result.output:
            final_response = result.output
            logging.info(f"Agent analysis successful in {run_duration:.2f} seconds. Response length: {len(final_response)}")
        elif hasattr(result, 'output'):
             logging.warning(f"ADK agent finished in {run_duration:.2f} seconds, but the 'output' was empty.")
             final_response = "AI agent finished but produced no output."
        else:
             logging.warning(f"ADK agent finished in {run_duration:.2f} seconds, but the result object lacks an 'output' attribute. Result: {result}")
             final_response = "AI agent finished but result format was unexpected."

        return final_response

    except Exception as e:
        # Catch any exception during agent.run() execution
        run_duration = time.monotonic() - start_time
        # Log the full exception details for debugging
        logging.error(f"ADK agent execution failed after {run_duration:.2f} seconds: {e}", exc_info=True)
        # Return a user-friendly error message to be posted as a comment in Gitea
        return "Error: Failed to perform AI code review due to an internal error."

# Example of how you might test this file locally (optional)
if __name__ == '__main__':
    logging.info("Running local test for agent_runner...")
    # Create a sample diff string (replace with a real one for better testing)
    sample_diff = """
diff --git a/test.dart b/test.dart
index abc..def 100644
--- a/test.dart
+++ b/test.dart
@@ -1,4 +1,5 @@
 void main() {
   print('Hello');
+  print('World'); // Added world
   calculate();
 }

@@ -7,3 +8,7 @@
   // TODO: Implement calculation
   return 0;
 }
+
+void unusedFunction() {
+  // This is not used
+}
"""
    # Ensure GOOGLE_APPLICATION_CREDENTIALS or gcloud ADC is set up locally
    print("\n--- Running Analysis ---")
    analysis_comment = run_analysis(sample_diff)
    print("\n--- Analysis Comment ---")
    print(analysis_comment)
    print("------------------------")