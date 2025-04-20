import google.adk as adk
from agent import create_review_agent # Import from agent.py

def run_analysis(diff_content: str) -> str:
    """Invokes the review agent with the provided diff."""
    agent = create_review_agent()

    # Format the input for the agent's instruction template
    # The instruction expects a dictionary where keys match placeholders
    agent_input = {"diff_content": diff_content}

    print("INFO: Invoking ADK agent for code review...")
    try:
        # Run the agent synchronously
        result = adk.run_sync(agent, data=agent_input)

        # Extract the final response text
        final_response = result.output # Adjust if ADK output structure differs

        print(f"INFO: Agent analysis complete. Response length: {len(final_response)}")
        return final_response

    except Exception as e:
        print(f"ERROR: ADK agent execution failed: {e}")
        return "Error: Failed to perform AI code review."