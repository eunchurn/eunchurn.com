import { Blog } from "contentlayer/generated";

const isProduction = process.env.NODE_ENV === "production";

export function filterNotDrafts(allBlogs: Blog[]) {
  if (!isProduction) return allBlogs;
  return allBlogs.filter((blog) => blog.draft !== true);
}
