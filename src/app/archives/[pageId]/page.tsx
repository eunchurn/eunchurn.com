import PageTitle from "@/components/PageTitle";
import { components } from "@/components/MDXComponents";
import { MDXLayoutRenderer } from "pliny/mdx-components";
import { sortPosts, coreContent, allCoreContent } from "pliny/utils/contentlayer";
import { allArchives } from "contentlayer/generated";
import { filterNotDrafts } from "@/utils/filter-drafts";
import type { Archive } from "contentlayer/generated";
import ArchiveLayout from "@/layouts/ArchiveLayout";
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
  const archive = allArchives.find((p) => p.slug === params.pageId);
  if (!archive) {
    return;
  }
  const { image } = archive;
  const ogImage = siteMetadata.siteUrl + image;

  return {
    title: archive.name,
    description: archive.summary,
    openGraph: {
      title: archive.name,
      description: archive.summary,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      url: "./",
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: archive.name,
      description: archive.summary,
      images: ogImage,
    },
  };
}

export const generateStaticParams = async () => {
  return allArchives.map((p) => ({ slug: p.slug.split("/").map((name) => decodeURI(name)) }));
};

export default async function Page(props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const pageId = decodeURI(params.pageId);
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(allArchives);
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === pageId);
  if (postIndex === -1) {
    return notFound();
  }

  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = allArchives.find((p) => p.slug === pageId) as Archive;
  const mainContent = coreContent(post);
  return (
    <>
      <ArchiveLayout content={mainContent}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </ArchiveLayout>
    </>
  );
}
