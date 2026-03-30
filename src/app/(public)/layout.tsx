import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "../globals.css";

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

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-blair-linen">{children}</body>
    </html>
  );
}
