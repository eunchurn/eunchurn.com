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

  try {
    console.log(`Fetching page ${pageId} from Notion API...`);
    // Add timeout to prevent build hanging
    const recordMap = await withTimeout(notion.getPage(pageId), 120000); // 120 seconds timeout

    // Cache successful result
    setCachedPage(pageId, recordMap);

    // console.log({ recordMap })
    // const previewImageMap = await getPreviewImageMap(recordMap)
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // ;(recordMap as any).preview_images = previewImageMap

    return recordMap;
  } catch (error) {
    console.error(`Failed to fetch Notion page ${pageId}:`, error);
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
}
