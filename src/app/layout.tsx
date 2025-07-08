import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blossom Private School",
  description: "Excellence in Education - Blossom Private School, Myingyan, Myanmar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
