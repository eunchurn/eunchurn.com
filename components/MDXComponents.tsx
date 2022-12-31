/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import Image from "./Image";
import CustomLink from "./Link";
import TOCInline from "./TOCInline";
import Pre from "./Pre";
import { BlogNewsletterForm } from "./NewsletterForm";
import AuthorLayout, { Props as AuthorLayoutProps } from "../layouts/AuthorLayout";
import ListLayout, { Props as ListLayoutProps } from "../layouts/ListLayout";
import PostLayout, { Props as PostLayoutProps } from "../layouts/PostLayout";
import PostSimple, { Props as PostSimpleProps } from "../layouts/PostSimple";

const Wrapper: React.ComponentType<{ layout: string }> = ({ layout, ...rest }) => {
  switch (layout) {
    case "AuthorLayout":
      return <AuthorLayout {...(rest as AuthorLayoutProps)} />;
    case "ListLayout":
      return <ListLayout {...(rest as ListLayoutProps)} />;
    case "PostLayout":
      return <PostLayout {...(rest as PostLayoutProps)} />;
    case "PostSimple":
      return <PostSimple {...(rest as PostSimpleProps)} />;
    default:
      return <></>;
  }
  // const Layout = require(`../layouts/${layout}`).default;
  // return <Layout {...rest} />;
};

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: Wrapper,
  BlogNewsletterForm,
};

interface Props {
  layout: string;
  mdxSource: string;
  [key: string]: unknown;
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }: Props) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />;
};
