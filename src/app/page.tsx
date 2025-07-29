import { sortPosts, allCoreContent } from "pliny/utils/contentlayer";
import { filterNotDrafts } from "@/utils/filter-drafts";
import { allBlogs } from "contentlayer/generated";
import Main from "./Main";
import { LayoutWrapper } from "@/components/layout-wrapper";

export default async function Page() {
  const sortedPosts = sortPosts(filterNotDrafts(allBlogs));
  const posts = allCoreContent(sortedPosts);
  return (
    <LayoutWrapper>
      <Main posts={posts} />
    </LayoutWrapper>
  );
}
