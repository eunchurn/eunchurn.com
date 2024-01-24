import "@/css/tailwind.css";
import "@/css/prism.css";
import "@/css/vimeo.css";
import "katex/dist/katex.css";
import "styles/root.css";
import "styles/notion.css";
// import "@fontsource/inter/variable-full.css";

import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";

import siteMetadata from "@/data/siteMetadata";
import Analytics from "@/components/analytics";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ClientReload } from "@/components/ClientReload";

import localFont from "next/font/local";

const pretendard = localFont({
  src: "./PretendardVariable.woff2",
  display: "swap",
});

const isDevelopment = process.env.NODE_ENV === "development";
const isSocket = process.env.SOCKET;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper>
        <main className={pretendard.className}>
          <Component {...pageProps} />
        </main>
      </LayoutWrapper>
    </ThemeProvider>
  );
}
