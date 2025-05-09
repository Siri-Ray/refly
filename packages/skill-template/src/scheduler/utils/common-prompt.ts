export const buildQueryIntentAnalysisInstruction = () => {
  return `### Query Intent Analysis Instructions
1. Analyze user intent by considering:
   - Original query: Direct user input reflecting raw intent
   - Optimized query: System-enhanced version for better search
   - Rewritten queries: Alternative interpretations of user intent

2. Response Guidelines:
   - Prioritize answering the user's actual intent over literal query interpretation
   - Synthesize information from all query variations to understand complete context
   - If available context doesn't align with true user intent, rely on common knowledge
   - Ensure responses are relevant to the core user need
   - Exclude irrelevant information even if present in the context

3. Response Structure:
   - First identify and address core user intent
   - Use most relevant information from provided context
   - Fill gaps with reliable common knowledge when needed
   - Maintain focus on user's primary goal`;
};

/**
 * Provides the current time information to be included in system prompts
 * @returns A string with current time information in various formats
 */
export const buildCurrentTimeInfo = () => {
  const now = new Date();

  // Format: YYYY-MM-DD HH:MM:SS in UTC and local time
  const utcTimeString = now.toISOString();
  const localTimeString = now.toString();

  return `## Current Time Information
Current UTC time: ${utcTimeString}
Current local time: ${localTimeString}`;
};
