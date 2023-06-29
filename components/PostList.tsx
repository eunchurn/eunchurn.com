import React from "react";
import Link from "@/components/Link";
import Tag from "@/components/Tag";
import Image from "@/components/Image";
import formatDate from "@/lib/utils/formatDate";
import { PostFrontMatter } from "types/PostFrontMatter";
import { getMDXComponent } from "mdx-bundler/client";

const blurDataUrl =
  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==";

interface PostListProps {
  frontMatter: PostFrontMatter;
  staticFolder: string;
}

export function PostList(props: PostListProps) {
  const {
    frontMatter: { slug, date, title, titleCode, summary, tags, featured },
    staticFolder,
  } = props;
  const Title = React.useMemo(() => getMDXComponent(titleCode), [titleCode]);
  return (
    <li className="py-12">
      <article>
        <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
              <time dateTime={date}>{formatDate(date)}</time>
            </dd>
            <dd className="pl-8 pt-8 -xl:invisible -xl:h-0 -xl:pt-0">
              {featured && (
                <Link href={`/blog/${slug}`}>
                  <Image
                    src={`${staticFolder}${featured}`}
                    alt={title}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", height: 100 }}
                    className="rounded-full"
                    placeholder="blur"
                    blurDataURL={blurDataUrl}
                    unoptimized
                  />
                </Link>
              )}
            </dd>
          </dl>
          <div className="container flex justify-between xl:col-span-3">
            <div className="space-y-5">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold leading-8 tracking-tight">
                    <Link
                      href={`/blog/${slug}`}
                      className="text-gray-900 dark:text-gray-100"
                    >
                      {/* @ts-ignore */}
                      <Title />
                      {/* {title} */}
                    </Link>
                  </h2>
                  <div className="flex flex-wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
                <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                  {summary}
                </div>
              </div>
              <div className="text-base font-medium leading-6">
                <Link
                  href={`/blog/${slug}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label={`Read "${title}"`}
                >
                  Read more &rarr;
                </Link>
              </div>
            </div>
            {featured && (
              <div className="aspect-w-1 relative min-w-1/4 pt-8 xl:invisible xl:w-0">
                <Link href={`/blog/${slug}`}>
                  <Image
                    src={`${staticFolder}${featured}`}
                    alt={title}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", height: 80 }}
                    className="rounded-full"
                    placeholder="blur"
                    blurDataURL={blurDataUrl}
                    unoptimized
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}
