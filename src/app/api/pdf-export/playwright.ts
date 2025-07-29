// import { chromium } from 'playwright'

// export const maxDuration = 60

// async function autoScroll(page: any) {
//   await page.evaluate(async () => {
//     await new Promise((resolve) => {
//       let totalHeight = 0
//       const distance = 100
//       const timer = setInterval(() => {
//         const scrollHeight = document.body.scrollHeight
//         window.scrollBy(0, distance)
//         totalHeight += distance

//         if (totalHeight >= scrollHeight) {
//           clearInterval(timer)
//           resolve(0)
//         }
//       }, 100)
//     })
//   })
// }

// export async function POST(req: Request) {
//   try {
//     const browser = await chromium.launch({
//       headless: true,
//       args: ['--no-sandbox'],
//     })

//     const context = await browser.newContext()
//     const page = await context.newPage()

//     const url = new URL(req.url)
//     const { slug } = (await req.json()) as { slug: string[] }

//     const targetURL = `${url.origin}/mdx-page/${slug.join('/')}`
//     await page.goto(targetURL, { waitUntil: 'networkidle' })

//     await page.emulateMedia({ media: 'screen' })
//     await autoScroll(page)

//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       scale: 0.9,
//       printBackground: true,
//       preferCSSPageSize: true,
//     })

//     await browser.close()

//     return new Response(pdfBuffer, {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'attachment; filename=mdx-output.pdf',
//       },
//     })
//   } catch (error) {
//     console.error('PDF 생성 오류:', error)
//     return new Response(JSON.stringify({ message: 'PDF 생성 실패', error }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     })
//   }
// }
