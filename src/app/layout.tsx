import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AI } from "@/app/actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pucho.ai",
  description: "AI powered search engine developed by Pucho.ai!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AI>
          {children}
        </AI>
      </body>
    </html>
  );
}
