# --- agent_runner.py ---

import logging
import time
import os

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Import AdkApp ---
try:
    from vertexai.preview.reasoning_engines import AdkApp
    logging.info("Successfully imported AdkApp from vertexai.preview.reasoning_engines")
except ImportError:
    logging.critical(
        "Could not import AdkApp from vertexai.preview.reasoning_engines. "
        "Ensure 'google-cloud-aiplatform' is installed correctly.",
        exc_info=True
    )
    raise SystemExit("AdkApp import failed.")

# --- Import Agent Creation Function ---
try:
    from agent import create_review_agent
except ImportError as e:
    logging.critical(f"Failed to import create_review_agent from agent: {e}", exc_info=True)
    raise SystemExit(f"ImportError: {e}")


# --- Core Analysis Function ---
def run_analysis(diff_content: str) -> str:
    """
    Creates the ADK agent, wraps it in AdkApp, invokes it using the streaming API,
    aggregates the final response by checking the correct event author,
    and returns the analysis result or an error message.
    """
    logging.info("Attempting to create ADK agent instance...")
    try:
        agent = create_review_agent()
        if not agent:
             raise ValueError("create_review_agent returned None")
        logging.info("ADK agent instance created.")
    except Exception as e:
         logging.error(f"Failed during agent creation: {e}", exc_info=True)
         return "Error: Failed to initialize AI code review agent."

    # Prepare Input message
    agent_input_message = f"Perform code review on the following diff content:\n\n```diff\n{diff_content}\n```"
    user_id_for_run = "gitea-pr-agent-user"

    logging.info(f"Invoking ADK agent '{agent.name}' via AdkApp stream_query for user '{user_id_for_run}' with combined message...")
    start_time = time.monotonic()
    final_response_parts = []
    full_result_events = [] # Store events for debugging if needed

    try:
        # Wrap the agent in AdkApp
        app = AdkApp(agent=agent)

        # Execute the agent using app.stream_query
        for event in app.stream_query(
            message=agent_input_message,
            user_id=user_id_for_run
        ):
            full_result_events.append(event)

            # --- CORRECTED CHECK FOR RESPONSE EVENT ---
            # Check if the author matches the AGENT'S NAME for the final response
            if isinstance(event, dict) and event.get('author') == agent.name:
                content = event.get('content', {})
                parts = content.get('parts', [])
                logging.info(f"Found potential final response event from author '{agent.name}'. Extracting text...") # Add log
                for part in parts:
                    if 'text' in part and part['text']: # Ensure text exists and is not empty
                        logging.info(f"Appending text part: {part['text'][:100]}...") # Log beginning of part
                        final_response_parts.append(part['text'])
                    else:
                        logging.warning(f"Found part without text in final response event: {part}")
            # --- END CORRECTION ---
            # You could add logging for other event types here if needed for debugging
            # elif isinstance(event, dict):
            #    logging.debug(f"Received non-model event: Author='{event.get('author')}', Keys={list(event.keys())}")


        run_duration = time.monotonic() - start_time

        # Combine the collected parts
        final_response = "".join(final_response_parts)

        if final_response:
            logging.info(f"Agent analysis successful via AdkApp stream_query in {run_duration:.2f} seconds. Final Response Length: {len(final_response)}")
        else:
            logging.warning(f"AdkApp stream_query finished in {run_duration:.2f} seconds, but no response parts found or extracted matching author '{agent.name}'.")
            if full_result_events:
                 logging.warning(f"Last few events from stream: {full_result_events[-5:]}")
            final_response = "AI agent finished but did not produce a parsable text response." # Keep this message

        return final_response

    except Exception as e:
        run_duration = time.monotonic() - start_time
        logging.error(f"AdkApp stream_query execution failed after {run_duration:.2f} seconds: {e}", exc_info=True)
        # Keep returning the generic error for the comment
        return "Error: Failed to perform AI code review due to an internal error during AdkApp execution."


# --- Local Testing Block ---
if __name__ == '__main__':
    logging.info("Running local test for agent_runner...")

    os.environ.setdefault('GOOGLE_CLOUD_PROJECT', 'pr-review-agent')
    os.environ.setdefault('GOOGLE_CLOUD_LOCATION', 'us-central1')
    logging.info(f"Using Project: {os.environ.get('GOOGLE_CLOUD_PROJECT')}, Location: {os.environ.get('GOOGLE_CLOUD_LOCATION')}")

    # Ensure local ADC is configured

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
    print("\n--- Running Analysis via AdkApp Stream Query (Corrected Author Check) ---")
    analysis_comment = run_analysis(sample_diff)
    print("\n--- Analysis Comment ---")
    print(analysis_comment) # This should now print the actual review
    print("------------------------")