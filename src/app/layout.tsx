import type { Metadata } from "next";
import "./globals.css";
import "../styles/admin-theme.css";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";

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
        <ReCaptchaProvider>
          {children}
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
