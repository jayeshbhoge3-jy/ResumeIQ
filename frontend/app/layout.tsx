import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import CustomCursor from "../components/CustomCursor";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "ResumeIQ | AI Resume Analyzer",
  description: "Get 2x more interviews by optimizing your resume with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${dmSans.variable} ${syne.variable} font-sans bg-background text-on-background antialiased`}>
        <div className="fixed inset-0 z-[-1] bg-dots"></div>
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
