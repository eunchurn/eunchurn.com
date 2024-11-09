import { Blog } from "contentlayer/generated";

export function filterNotDrafts(allBlogs: Blog[]) {
  return allBlogs.filter((allBlogs) => allBlogs.draft !== true);
}
