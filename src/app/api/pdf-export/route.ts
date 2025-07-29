import chromium from "@sparticuz/chromium";
import { type Browser, executablePath } from "puppeteer";
import puppeteerCore, { type Browser as BrowserCore, type Page } from "puppeteer-core";

chromium.setGraphicsMode = false;

export const maxDuration = 300;

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve(0);
        }
      }, 100);
    });
  });
}

export async function POST(req: Request) {
  try {
    let browser: Browser | BrowserCore | null = null;
    if (process.env.NODE_ENV === "production") {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
        defaultViewport: {
          deviceScaleFactor: 1,
          hasTouch: false,
          height: 1080,
          isLandscape: true,
          isMobile: false,
          width: 1920,
        },
        // defaultViewport: chromium.defaultViewport,
        // headless: chromium.headless,
      });
    } else {
      browser = await puppeteerCore.launch({
        executablePath: executablePath(),
        headless: "shell",
        args: ["--font-render-hinting=none", "--no-sandbox"],
      });
    }

    if (!browser) {
      throw new Error("브라우저 생성 실패");
    }
    const page = await browser.newPage();

    const url = new URL(req.url);
    const { pageId } = (await req.json()) as { pageId: string };

    const targetURL = `${url.origin}/cv-export/${pageId}`;
    await page.goto(targetURL, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");
    await autoScroll(page);
    // PDF 생성
    const pdfBuffer = (await page.pdf({
      format: "A4",
      scale: 0.9,
      printBackground: true, // Tailwind 스타일 유지
      preferCSSPageSize: true,
    })) as Buffer<ArrayBuffer>;

    await browser.close();
    // PDF 반환
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=mdx-output.pdf",
      },
    });
  } catch (error) {
    console.error("PDF 생성 오류:", error);
    return new Response(JSON.stringify({ message: "PDF 생성 실패", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
