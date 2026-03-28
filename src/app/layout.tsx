import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Cormorant } from "next/font/google";
import { SessionProvider } from "@/components/shared/SessionProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const cursiveFont = Cormorant({
  weight: "400",
  subsets: ["latin"],
  style: "italic",
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  title: "Blair",
  description:
    "Your personalized career playbook - discover your strengths and chart your path forward.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerifDisplay.variable} ${cursiveFont.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
