// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <MainNav />
          <main className="p-8">{children}</main>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}