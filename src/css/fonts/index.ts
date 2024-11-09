import localFont from "next/font/local";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";

export const nanumSquareNeoVariable: NextFontWithVariable = localFont({
  src: "./NanumSquareNeo-Variable.woff2",
  display: "swap",
  variable: "--font-nanum-square-neo-variable",
});
