import { generateBaseMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata = generateBaseMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
