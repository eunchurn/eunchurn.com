import * as React from "react";
import { NotionPage } from "@/components/NotionPage";
import { getPage } from "@/utils/notion";
import { redirect } from "next/navigation";

const rootNotionPageId = "1a91b7f9da0d443f888aec63234a0d8a";

// Force static generation - disable ISR for this route
export const dynamic = "force-static";

export const maxDuration = 60; // 1 minute timeout

export async function generateStaticParams() {
  // Return all possible params to force static generation
  // Exclude root page ID since it's handled by /cv route
  const staticParams = [
    { pageId: "38279f2737c944c4b7cad33d92942852" }, // Backend stack
    { pageId: "144e260d9fef425fadfb9994016d57da" }, // Frontend stack
    { pageId: "1328ec013dd1462886b2c8a7382cb3c7" }, // 경력기술서
    // Also include potential variations with dashes (in case they exist)
    { pageId: "38279f27-37c9-44c4-b7ca-d33d92942852" },
    { pageId: "144e260d-9fef-425f-adfb-9994016d57da" },
    { pageId: "1328ec01-3dd1-4628-86b2-c8a7382cb3c7" },
  ];

  console.log("Generated static params for CV pages:", staticParams);
  return staticParams;
}
export default async function Page(props: { params: Promise<{ pageId?: string }> }) {
  const { pageId } = await props.params;
  const id = (() => {
    if (!pageId) return rootNotionPageId;

    // Extract actual Notion page ID from URL-encoded pageId
    // Notion page URLs can have titles prepended, so we need to extract the UUID
    const notionIdPattern =
      /([a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i;
    const match = pageId.match(notionIdPattern);

    if (match) {
      const extractedId = match[1].replace(/-/g, ""); // Remove dashes for consistency
      console.log(`Extracted Notion ID: ${extractedId} from pageId: ${pageId}`);
      return extractedId;
    }

    // Fallback: if no UUID pattern found, return as is
    console.warn(`Could not extract UUID from pageId: ${pageId}, using as is`);
    return pageId as string;
  })();

  // If this is the root page ID, redirect to /cv
  if (id === rootNotionPageId) {
    redirect("/cv");
  }

  try {
    console.log(`Loading CV page: ${id}`);
    const recordMap = await getPage(id);

    // Check if recordMap has valid data
    if (!recordMap || Object.keys(recordMap.block).length === 0) {
      console.warn(`Empty recordMap for page ${id}, trying fallback`);
      const fallbackRecordMap = await getPage(rootNotionPageId);
      return <NotionPage recordMap={fallbackRecordMap} rootPageId={rootNotionPageId} />;
    }

    return <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />;
  } catch (error) {
    console.error(`Error loading CV page ${id}:`, error);
    try {
      // Fallback to root page if specific page fails
      console.log("Attempting to load fallback root page");
      const fallbackRecordMap = await getPage(rootNotionPageId);
      return <NotionPage recordMap={fallbackRecordMap} rootPageId={rootNotionPageId} />;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      // Return a simple error page
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-4 text-2xl font-bold">페이지를 불러올 수 없습니다</h1>
          <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
        </div>
      );
    }
  }
}
