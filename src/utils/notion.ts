import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";
import { getPreviewImageMap } from "./preview-images";

const notion = new NotionAPI();
export default notion;

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId);
  // console.log({ recordMap })
  // const previewImageMap = await getPreviewImageMap(recordMap)
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // ;(recordMap as any).preview_images = previewImageMap

  return recordMap;
}
