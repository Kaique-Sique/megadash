import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FRC Dash",
  description: "Dashboard NetworkTables 4 para FRC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
