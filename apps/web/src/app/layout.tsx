import type { Metadata } from "next";
import "./globals.css";
import { getDictionary } from "@/lib/i18n";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Poker Trainer FE",
  description: "Next.js foundation cho FE Refactor Day 1",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const dict = await getDictionary("vi");

  return (
    <html lang="vi">
      <body>
        <AppShell
          title={dict.page.title}
          nav={[
            { href: "/", label: dict.nav.home },
            { href: "/table", label: dict.nav.table },
            { href: "/review", label: dict.nav.review },
            { href: "/progress", label: dict.nav.progress },
          ]}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
