import * as React from "react";
import { NotionPage } from "@/components/NotionPage";
import { getPage } from "@/utils/notion";

const rootNotionPageId = "1a91b7f9da0d443f888aec63234a0d8a";

export default async function Page() {
  const recordMap = await getPage(rootNotionPageId);
  return <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />;
}
