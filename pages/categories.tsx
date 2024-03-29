import Link from "@/components/Link";
import { PageSEO } from "@/components/SEO";
import Tag from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { getAllCategories } from "@/lib/categories";
import kebabCase from "@/lib/utils/kebabCase";
import { GetStaticProps, InferGetStaticPropsType } from "next";

export const getStaticProps: GetStaticProps<{
  categories: Record<string, number>;
}> = async () => {
  const categories = await getAllCategories("blog");

  return { props: { categories } };
};

export default function Categories({
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sortedCategories = Object.keys(categories).sort(
    (a, b) => categories[b] - categories[a],
  );
  return (
    <>
      <PageSEO
        title={`Categories - ${siteMetadata.author}`}
        description="Things I blog about"
      />
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Categories
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {Object.keys(categories).length === 0 && "No categories found."}
          {sortedCategories.map((t) => {
            return (
              <div key={t} className="mt-2 mb-2 mr-5">
                <Tag text={t} />
                <Link
                  href={`/categories/${kebabCase(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                >
                  {` (${categories[t]})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
