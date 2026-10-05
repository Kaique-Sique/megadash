import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { NTProvider } from "@/components/providers/NTProvider";

import { siteConfig } from "@/lib/config/site-config";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full pb-12">
        <NTProvider>
          <Navbar />
          {children}
        </NTProvider>
        <Footer />
      </body>
    </html>
  );
}
