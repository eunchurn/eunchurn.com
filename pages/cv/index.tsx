import * as React from "react";
import { ExtendedRecordMap } from "notion-types";
import { NotionPage } from "components/NotionPage";

import notion from "lib/notion";
// import "react-notion-x/src/styles.css";

const rootNotionPageId = "1a91b7f9da0d443f888aec63234a0d8a";

export const getStaticProps = async () => {
  const recordMap = await notion.getPage(rootNotionPageId);

  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  };
};

// export async function getStaticPaths() {
//   return {
//     paths: ["/content"],
//     fallback: true,
//   };
// }

export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />;
}
