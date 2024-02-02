import Document, { Html, Head, Main, NextScript } from "next/document";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { staticFolder },
} = getConfig();

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href={`${staticFolder}/static/favicons/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${staticFolder}/static/favicons/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${staticFolder}/static/favicons/favicon-16x16.png`}
          />
          <link
            rel="manifest"
            href={`${staticFolder}/static/favicons/site.webmanifest`}
          />
          <link
            rel="mask-icon"
            href={`${staticFolder}/static/favicons/safari-pinned-tab.svg`}
            color="#5bbad5"
          />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" content="#000000" />
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
          {/* <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/gh/eunchurn/NanumSquareNeo@0.0.2/nanumsquareneo.css"
          ></link>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.rawgit.com/innks/NanumSquareRound/master/nanumsquareround.min.css"
          ></link> */}
          <link rel="preconnect" href="https://fonts.googleapis.com"></link>
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <body className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
