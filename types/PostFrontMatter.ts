export type PostFrontMatter = {
  title: string;
  titleCode: string;
  date: string;
  tags: string[];
  lastmod?: string;
  draft?: boolean;
  summary?: string;
  images?: string[];
  authors?: string[];
  layout?: string;
  canonicalUrl?: string;
  slug: string;
  fileName: string;
  featured?: string;
  categories?: string[];
};
