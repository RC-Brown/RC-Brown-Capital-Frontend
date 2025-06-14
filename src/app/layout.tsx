import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NextTopLoader from "nextjs-toploader";

const pps = Poppins({
  variable: "--font-pps",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  adjustFontFallback: false,
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RC Brown Capital",
  description: "Gateway to high yeid Real Estate Investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning={true} className='h-full'>
      <body className={`${pps.variable} antialiased`} suppressHydrationWarning={true}>
        <Providers>
          {children}
          <NextTopLoader color='#1F3B5F' showSpinner={false} />
        </Providers>
      </body>
    </html>
  );
}
