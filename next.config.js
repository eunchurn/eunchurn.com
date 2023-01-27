const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// const withPWA = pwa({ dest: "public", register: true, skipWaiting: true });
const isProd = process.env.NODE_ENV === "production";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: !isProd,
});

// const withPlugins = require("next-compose-plugins");

// You might need to insert additional domains in script-src if you are using external services
// style-src 'self' 'unsafe-inline';
// font-src 'self';
// default-src 'self';
const ContentSecurityPolicy = `
  script-src 'self' 'unsafe-eval' 'unsafe-inline' data: giscus.app youtube.com soundcloud.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  frame-src giscus.app *.youtube.com *.soundcloud.com *.vimeo.com;
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  eslint: {
    dirs: ["pages", "components", "lib", "layouts", "scripts"],
  },
  images: {
    unoptimized: true,
    // loader: "cloudinary",
    // path: "https://res.cloudinary.com/dspxl7nqq/image/upload/",
  },
  experimental: {},
  assetPrefix: "",
  publicRuntimeConfig: {
    staticFolder: "",
  },
  // i18n: {
  //   locales: ["ko"],
  //   defaultLocale: "ko",
  // },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
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

    if (!dev && !isServer) {
      // Replace React with Preact only in client production build
      Object.assign(config.resolve.alias, {
        "react/jsx-runtime.js": "preact/compat/jsx-runtime",
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }

    return config;
  },
};

const KEYS_TO_OMIT = [
  "webpackDevMiddleware",
  "configOrigin",
  "target",
  "analyticsId",
  "webpack5",
  "amp",
  "assetPrefix",
];

// manage i18n
// if (process.env.EXPORT === "true") {
//   nextConfig.i18n = {};
// }

// asset prefix
if (process.env.GITHUB === "true") {
  nextConfig.assetPrefix = isProd ? "/eunchurn.com/" : "";
  nextConfig.basePath = isProd ? "/eunchurn.com" : "";
  nextConfig.publicRuntimeConfig.staticFolder = isProd ? "/eunchurn.com" : "";
}

module.exports = (_phase, { defaultConfig }) => {
  const plugins = [[withPWA], [withBundleAnalyzer, {}]];

  const wConfig = plugins.reduce((acc, [plugin, config]) => plugin({ ...acc, ...config }), {
    ...defaultConfig,
    ...nextConfig,
  });

  const finalConfig = {};
  Object.keys(wConfig).forEach((key) => {
    if (!KEYS_TO_OMIT.includes(key)) {
      finalConfig[key] = wConfig[key];
    }
  });

  return finalConfig;
};

// const buildConfig = (phase, { defaultConfig }) => {
//   const plugins = [withBundleAnalyzer, withPWA];
//   /**
//    * @type {import('next').NextConfig}
//    */
//   const config = plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig });
//   return config;
// };
