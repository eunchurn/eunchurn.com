"use client";
import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import { Pdf } from "react-notion-x/build/third-party/pdf";
// import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import { getPageTitle, getCanonicalPageId } from "notion-utils";
import dynamic from "next/dynamic";
import TweetEmbed from "react-tweet-embed";
import { NotionRenderer } from "react-notion-x";
import { Code } from "react-notion-x/build/third-party/code";
import { Collection } from "react-notion-x/build/third-party/collection";
import { Equation } from "react-notion-x/build/third-party/equation";
// const NotionRenderer = dynamic(() => import('react-notion-x').then((m) => m.NotionRenderer))

// const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((m) => m.Code))
// const Collection = dynamic(() =>
//   import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
// )
// const Equation = dynamic(() =>
//   import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
// )
// const Pdf = dynamic(
//   () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
//   {
//     ssr: false,
//   },
// );
// const Modal = dynamic(
//   () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
//   {
//     ssr: false,
//   },
// );

const Tweet = ({ id }: { id: string }) => {
  return <TweetEmbed tweetId={id} />;
};

export const NotionPage = ({
  recordMap,
  rootPageId,
}: {
  recordMap: ExtendedRecordMap;
  rootPageId?: string;
}) => {
  if (!recordMap) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Loading...</h2>
          <p className="text-gray-600">Please wait while we load the content.</p>
        </div>
      </div>
    );
  }

  // Check if recordMap has content
  const hasBlocks = recordMap.block && Object.keys(recordMap.block).length > 0;

  if (!hasBlocks) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Content Unavailable</h2>
          <p className="text-gray-600">
            This page content is temporarily unavailable. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const title = getPageTitle(recordMap);
  return (
    <>
      <Head>
        <meta name="description" content="Eunchurn Park's Resume/Curriculum Vitae" />

        <title>{title}</title>
      </Head>

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        // darkMode={false}
        rootPageId={rootPageId}
        disableHeader={true}
        mapPageUrl={(pageId) => {
          const canonicalPageId = getCanonicalPageId(pageId, recordMap);
          return `/cv/${canonicalPageId}`;
        }}
        previewImages
        components={{
          Code,
          Collection,
          Equation,
          // Modal,
          // Pdf,
          Tweet,
          nextImage: Image,
          nextLink: Link,
        }}
      />
    </>
  );
};
