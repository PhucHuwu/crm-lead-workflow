import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { DocsShell } from "@/components/docs-shell";
import "./globals.css";
import "./visuals.css";

const font = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"], variable: "--font-guide", display: "swap" });
export const metadata: Metadata = {
  title: { default: "Sổ tay Workflow — Tìm khách cùng Claude", template: "%s | Sổ tay Workflow" },
  description: "Hướng dẫn từng bước sử dụng Claude Desktop, tìm khách hàng, kết nối TinaCRM và chăm sóc khách bằng email. Dành cho người mới bắt đầu.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={font.variable}><DocsShell>{children}</DocsShell></body></html>;
}
