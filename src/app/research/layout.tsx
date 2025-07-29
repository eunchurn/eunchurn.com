import { LayoutWrapper } from "@/components/layout-wrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
