import { slug } from "github-slugger";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import siteMetadata from "@/data/siteMetadata";
import ListLayout from "@/layouts/ListLayoutCategories";
import { allBlogs } from "contentlayer/generated";
import { filterNotDrafts } from "@/utils/filter-drafts";
import categoriesData from "@/app/category-data.json";
import { genPageMetadata } from "@/app/seo";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const category = decodeURI(params.category);
  return genPageMetadata({
    title: category,
    description: `${siteMetadata.title} ${category}`,
    alternates: {
      canonical: "./",
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/tags/${category}/feed.xml`,
      },
    },
  });
}

export const generateStaticParams = async () => {
  const categoriesCounts = categoriesData as Record<string, number>;
  const categoriesKeys = Object.keys(categoriesCounts);
  const paths = categoriesKeys.map((categories) => ({
    categories: encodeURI(categories),
  }));
  return paths;
};

export default async function TagPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const categories = decodeURI(params.category);
  // Capitalize first letter and convert space to dash
  const title = categories[0].toUpperCase() + categories.split(" ").join("-").slice(1);
  const filteredPosts = allCoreContent(
    sortPosts(
      filterNotDrafts(allBlogs).filter(
        (post) => post.categories && post.categories.map((t) => slug(t)).includes(categories)
      )
    )
  );
  if (filteredPosts.length === 0) {
    return notFound();
  }
  return <ListLayout posts={filteredPosts} title={title} />;
}
