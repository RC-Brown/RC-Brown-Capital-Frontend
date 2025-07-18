import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Navbar from "../components/molecules/navbar";

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
  icons: {
    icon: "/rc-favicon.png",
    shortcut: "/rc-favicon.png",
    apple: "/rc-favicon.png",
  },
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
          <main>
            <Navbar />
            <div className='mt-24 h-full min-h-[calc(100vh-100px)] bg-background-secondary'>{children}</div>
          </main>
          <NextTopLoader color='#1F3B5F' showSpinner={false} />
          <Toaster richColors={true} closeButton position='top-center' />
        </Providers>
      </body>
    </html>
  );
}
