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
  const maxRetries = 2;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetching page ${pageId} from Notion API... (attempt ${attempt}/${maxRetries})`);

      // Progressive timeout - start with shorter timeout, increase on retry
      const timeout = attempt === 1 ? 20000 : 45000; // 20s first, then 45s
      const recordMap = await withTimeout(notion.getPage(pageId), timeout);

      // Validate the response
      if (!recordMap || typeof recordMap !== "object") {
        throw new Error("Invalid response from Notion API");
      }

      // Cache successful result
      setCachedPage(pageId, recordMap);
      console.log(`Successfully fetched and cached page ${pageId}`);

      return recordMap;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed for page ${pageId}:`, error);

      // Wait before retry (except on last attempt)
      if (attempt < maxRetries) {
        console.log(`Waiting 2s before retry...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  console.error(`All attempts failed for Notion page ${pageId}:`, lastError);
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
