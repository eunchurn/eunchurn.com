import { Inter } from "next/font/google";
import SectionContainer from "./section-container";
import Footer from "./Footer";
import { ReactNode } from "react";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const inter = Inter({
  subsets: ["latin"],
});

export const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <div className={"flex h-screen flex-col justify-between font-sans"}>
        <Header />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
};
