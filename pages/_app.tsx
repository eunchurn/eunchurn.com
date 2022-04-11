import "@/css/tailwind.css";
import "@/css/prism.css";
import "katex/dist/katex.css";

// import "@fontsource/inter/variable-full.css";

import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";

import siteMetadata from "@/data/siteMetadata";
import Analytics from "@/components/analytics";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ClientReload } from "@/components/ClientReload";

const isDevelopment = process.env.NODE_ENV === "development";
const isSocket = process.env.SOCKET;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@1.0/nanumsquare.css"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  );
}
