import pwa from "next-pwa";
import { withContentlayer } from "next-contentlayer2";
import { withNextVideo } from "next-video/process";
import bundleAnalyzer from "@next/bundle-analyzer";
import { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const withPWA = pwa({
  dest: "public",
  disable: !isProd,
});
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   disable: !isProd,
// })

// const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// const ContentSecurityPolicy = `
//   script-src 'self' 'unsafe-eval' 'unsafe-inline' data: giscus.app youtube.com soundcloud.com googletagmanager.com;
//   img-src * blob: data:;
//   media-src 'none';
//   connect-src *;
//   frame-src giscus.app *.youtube.com *.soundcloud.com *.vimeo.com *.mixcloud.com;
// `;
// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is youtube.com soundcloud.com mixcloud.com googletagmanager.com;
  style-src 'self' 'unsafe-inline' *.mixcloud.com;
  img-src * blob: data:;
  media-src *.s3.amazonaws.com *.mixcloud.com *.vercel-storage.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app *.youtube.com *.soundcloud.com *.vimeo.com *.mixcloud.com;
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const output = process.env.EXPORT ? "export" : undefined;
const basePath = process.env.BASE_PATH || undefined;
const unoptimized = process.env.UNOPTIMIZED ? true : undefined;

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer, withPWA];
  // @ts-ignore
  const config = plugins.reduce((acc, next) => next(acc), {
    output,
    basePath,
    reactStrictMode: true,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    eslint: {
      dirs: ["app", "components", "layouts", "scripts"],
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "picsum.photos",
        },
        { protocol: "https", hostname: "www.notion.so" },
        { protocol: "https", hostname: "notion.so" },
        { protocol: "https", hostname: "images.unsplash.com" },
        { protocol: "https", hostname: "pbs.twimg.com" },
      ],
      unoptimized,
      // unoptimized: process.env.NODE_ENV !== "production",
    },
    publicRuntimeConfig: {
      staticFolder: "",
    },
    serverRuntimeConfig: {
      staticFolder: "",
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    },
    turbopack: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|mp4)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "/_next",
              name: "static/media/[name].[hash].[ext]",
            },
          },
        ],
      });
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });

      return config;
    },
  } as NextConfig);
  return withNextVideo(config, { provider: "vercel-blob" });
};
