import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Megadash",
  description: "FRC dashboard for NetworkTables v4 from megazord 7563",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">
        {children}
       <Footer />
      </body>
    </html>
  );
}
