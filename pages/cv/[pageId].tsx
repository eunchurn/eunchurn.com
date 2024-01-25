import * as React from "react";
import { ExtendedRecordMap } from "notion-types";
import { GetStaticPropsContext } from "next";
import { NotionPage } from "components/NotionPage";
import { getPage } from "lib/notion";

const rootNotionPageId = "1a91b7f9da0d443f888aec63234a0d8a";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const pageId = (() => {
    if (!params) return rootNotionPageId;
    return params.pageId as string;
  })();
  const recordMap = await getPage(pageId);

  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  return {
    paths: [
      "/cv/38279f2737c944c4b7cad33d92942852", // Backend stack
      "/cv/144e260d9fef425fadfb9994016d57da", // Frontend stack
      "/cv/1328ec013dd1462886b2c8a7382cb3c7", // 경력기술서
    ],
    fallback: true,
  };
}

export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />;
}
