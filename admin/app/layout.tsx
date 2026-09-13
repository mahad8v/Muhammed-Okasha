import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/app/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Content Admin",
  description: "Manage reciters and scholars content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full bg-background text-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto w-full max-w-5xl px-10 py-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
