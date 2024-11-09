import PageTitle from "@/components/PageTitle";
import { components } from "@/components/MDXComponents";
import { MDXLayoutRenderer } from "pliny/mdx-components";
import { sortPosts, coreContent, allCoreContent } from "pliny/utils/contentlayer";
import { allHistories } from "contentlayer/generated";
import { filterNotDrafts } from "@/utils/filter-drafts";
import type { Authors, Blog, History } from "contentlayer/generated";
import HistoryLayout from "@/layouts/HistoryLayout";
import PostLayout from "@/layouts/PostLayout";
import PostBanner from "@/layouts/PostBanner";
import { Metadata } from "next";
import siteMetadata from "@/data/siteMetadata";
import { notFound } from "next/navigation";
// import { MDXLayoutRenderer } from '@/components/history-item'

export async function generateMetadata(props: {
  params: Promise<{ pageId: string }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  const history = allHistories.find((p) => p.slug === params.pageId);
  if (!history) {
    return;
  }
  const { image } = history;
  const ogImage = siteMetadata.siteUrl + image;

  return {
    title: history.name,
    description: history.summary,
    openGraph: {
      title: history.name,
      description: history.summary,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      url: "./",
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: history.name,
      description: history.summary,
      images: ogImage,
    },
  };
}

export const generateStaticParams = async () => {
  return allHistories.map((p) => ({ slug: p.slug.split("/").map((name) => decodeURI(name)) }));
};

export default async function Page(props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const pageId = decodeURI(params.pageId);
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(allHistories);
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === pageId);
  if (postIndex === -1) {
    return notFound();
  }

  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = allHistories.find((p) => p.slug === pageId) as History;
  const mainContent = coreContent(post);
  // add ul className
  const ulCode = post.body.code.replaceAll("ul,{", 'ul,{className:"icon-list",');
  // add li className
  const code = ulCode.replaceAll("li,{", 'li,{className:"icon-list-item",');
  return (
    <>
      <HistoryLayout content={mainContent}>
        <MDXLayoutRenderer code={code} components={components} toc={post.toc} />
      </HistoryLayout>
    </>
  );
}
