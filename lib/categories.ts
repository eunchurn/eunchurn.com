import { PostFrontMatter } from "types/PostFrontMatter";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { getFiles } from "./mdx";
import kebabCase from "./utils/kebabCase";

const root = process.cwd();

const isDevelopment = process.env.NODE_ENV === "development";

export async function getAllCategories(type: "blog" | "authors") {
  const files = getFiles(type);

  const categoryCount: Record<string, number> = {};
  // Iterate through each post, putting all found categories into `categories`
  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, "data", type, file), "utf8");
    const matterFile = matter(source);
    const data = matterFile.data as PostFrontMatter;

    if (
      (data.categories && data.draft !== true) ||
      (data.categories && data.draft === true && isDevelopment)
    ) {
      data.categories.forEach((category) => {
        const formattedcategory = kebabCase(category);
        if (formattedcategory in categoryCount) {
          categoryCount[formattedcategory] += 1;
        } else {
          categoryCount[formattedcategory] = 1;
        }
      });
    }
  });

  return categoryCount;
}
