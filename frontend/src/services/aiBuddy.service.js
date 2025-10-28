// Import the specific 'aiBuddyApi' from your main api.js file
import { aiBuddyApi } from "./api";

/**
 * Sends a search query to the AI Buddy agent.
 * @param {string} query - The user's search query.
 */
export async function searchAI(query) {
  // Calls GET https://[your-ai-buddy-service-url].onrender.com/api/search
  const res = await aiBuddyApi.get("/ai-buddy/search", {
    params: { q: query },
  });

  return res.data;
}
