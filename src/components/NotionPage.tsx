"use client";
import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import { Pdf } from "react-notion-x/build/third-party/pdf";
// import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import { getPageTitle } from "notion-utils";
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
      <div className="mb-4 flex justify-end">
        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
          onClick={() => {
            // PDF export functionality will be implemented here
            console.log("Export PDF clicked");
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export PDF
        </button>
      </div>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        // darkMode={false}
        rootPageId={rootPageId}
        disableHeader={true}
        mapPageUrl={(pageId) => {
          // Use raw pageId instead of canonical page id to avoid title in URL
          const cleanPageId = pageId.replace(/-/g, ""); // Remove dashes for consistency

          // If it's the root CV page, redirect to /cv
          if (cleanPageId === rootPageId) {
            return "/cv";
          }

          return `/cv/${cleanPageId}`;
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
