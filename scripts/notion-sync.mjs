// Fetch the Notion CV pages and store them as JSON for the build to read.
// www.notion.so answers 403 to Node's fetch (so `next build` on Vercel cannot fetch),
// but Bun's fetch gets through. Run with Bun: bun run notion:sync
import { NotionAPI } from "notion-client";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PAGE_IDS = [
  "1a91b7f9da0d443f888aec63234a0d8a", // CV root
  "38279f2737c944c4b7cad33d92942852", // Backend stack
  "144e260d9fef425fadfb9994016d57da", // Frontend stack
  "1328ec013dd1462886b2c8a7382cb3c7", // 경력기술서
];

const outDir = path.join(process.cwd(), "data", "notion");
await mkdir(outDir, { recursive: true });
const notion = new NotionAPI();

for (const id of PAGE_IDS) {
  const recordMap = await notion.getPage(id);
  const blocks = Object.keys(recordMap.block ?? {}).length;
  if (blocks === 0) throw new Error(`Notion returned no blocks for ${id}`);
  // Signed asset URLs expire within hours; drop them so the renderer falls back to notion.so proxies.
  recordMap.signed_urls = {};
  // Uploaded videos use an "attachment:" source the browser cannot load. notion.so/signed/ proxies
  // it to a freshly signed file URL on every request, so point the block there instead.
  for (const [blockId, entry] of Object.entries(recordMap.block)) {
    const value = entry?.value?.value ?? entry?.value;
    const source = value?.properties?.source?.[0]?.[0];
    if (value?.type === "video" && typeof source === "string" && source.startsWith("attachment:")) {
      value.properties.source[0][0] = `https://www.notion.so/signed/${encodeURIComponent(source)}?table=block&id=${blockId}`;
    }
  }
  const file = path.join(outDir, `${id}.json`);
  await writeFile(file, JSON.stringify(recordMap));
  console.log(`${id}: ${blocks} blocks -> ${path.relative(process.cwd(), file)}`);
}
