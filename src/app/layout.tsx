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
      <body className="font-sans antialiased bg-[#fcfcfc] text-secondary-900 selection:bg-primary-100 selection:text-primary-900">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{ className: "font-sans" }}
        />
      </body>
    </html>
  );
}
