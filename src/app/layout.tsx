import { generateBaseMetadata } from "@/lib/seo/metadata";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = generateBaseMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[var(--color-background,#fcfcfc)] text-[var(--color-gray-900,#111827)] selection:bg-[var(--color-primary-100,#dbeafe)] selection:text-[var(--color-primary-900,#1e3a8a)]">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{ className: "font-sans" }}
        />
      </body>
    </html>
  );
}
