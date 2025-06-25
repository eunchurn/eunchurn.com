import * as React from "react";
import { NotionPage } from "@/components/NotionPage";
import { getPage } from "@/utils/notion";

const rootNotionPageId = "1a91b7f9da0d443f888aec63234a0d8a";

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

export async function generateStaticParams() {
  // Return params synchronously to avoid API calls during build
  const staticParams = [
    { pageId: "38279f2737c944c4b7cad33d92942852" }, // Backend stack
    { pageId: "144e260d9fef425fadfb9994016d57da" }, // Frontend stack
    { pageId: "1328ec013dd1462886b2c8a7382cb3c7" }, // 경력기술서
  ];

  console.log("Generated static params for CV pages:", staticParams);
  return staticParams;
}

export default async function Page(props: { params: Promise<{ pageId?: string }> }) {
  const { pageId } = await props.params;
  const id = (() => {
    if (!pageId) return rootNotionPageId;
    return pageId as string;
  })();

  try {
    const recordMap = await getPage(id);
    return <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />;
  } catch (error) {
    console.error(`Error loading CV page ${id}:`, error);
    // Fallback to root page if specific page fails
    const fallbackRecordMap = await getPage(rootNotionPageId);
    return <NotionPage recordMap={fallbackRecordMap} rootPageId={rootNotionPageId} />;
  }
}
