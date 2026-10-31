import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";
import { getCachedPage, setCachedPage } from "./notion-cache";
// import { getPreviewImageMap } from "./preview-images";

const notion = new NotionAPI();
export default notion;

// Timeout wrapper for API calls
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  // Check cache first
  const cached = getCachedPage(pageId);
  if (cached) {
    console.log(`Using cached data for page ${pageId}`);
    return cached;
  }

  // Retry logic for better reliability
  let lastError: Error | null = null;
  const maxRetries = 4;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetching page ${pageId} from Notion API... (attempt ${attempt}/${maxRetries})`);

      // Progressive timeout - start with shorter timeout, increase on retry
      const timeout = attempt === 1 ? 30000 : 60000; // 30s first, then 60s
      const recordMap = await withTimeout(notion.getPage(pageId), timeout);

      // Validate the response
      if (!recordMap || typeof recordMap !== "object") {
        throw new Error("Invalid response from Notion API");
      }
      // An empty block map means Notion answered without the page (blocked, private, or rate limited)
      if (!recordMap.block || Object.keys(recordMap.block).length === 0) {
        throw new Error("Notion API returned a page with no blocks");
      }

      // Cache successful result
      setCachedPage(pageId, recordMap);
      console.log(`Successfully fetched and cached page ${pageId}`);

      return recordMap;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed for page ${pageId}:`, error);

      // Wait before retry (except on last attempt), backing off each time
      if (attempt < maxRetries) {
        const delay = 3000 * attempt;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`All attempts failed for Notion page ${pageId}:`, lastError);
  // During the production build, fail loudly instead of publishing an empty CV.
  // shortcut: build-time only; move to ISR if Notion keeps blocking the build host
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.VERCEL === "1") {
    throw lastError ?? new Error(`Could not load Notion page ${pageId}`);
  }
  // Return a minimal fallback recordMap structure
  return {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    comment: {},
    signed_urls: {},
  } as ExtendedRecordMap;
}
