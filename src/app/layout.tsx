import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../contexts/CartContext";
import { ApolloProvider } from "../components/ApolloProvider";
import { HydrationSafeProvider } from "../components/HydrationSafeProvider";
import Image from "next/image";
import Link from "next/link";
import CartButtonAndPanel from "../components/CartButtonAndPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Choripam",
  description: "Choripam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <HydrationSafeProvider>
          <ApolloProvider>
            <CartProvider>
              <header className="fixed top-0 left-0 w-full z-50 bg-black/95 border-b border-zinc-900 flex items-center justify-between px-6 py-2 shadow-xl">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="https://terrazaedenfiles.s3.us-east-2.amazonaws.com/WhatsApp+Image+2025-07-04+at+4.36.20+PM.jpeg" alt="Logo Choripam" width={120} height={60} className="drop-shadow-xl" />
                </Link>
                <CartButtonAndPanel />
              </header>
              <div className="pt-24">{children}</div>
            </CartProvider>
          </ApolloProvider>
        </HydrationSafeProvider>
      </body>
    </html>
  );
}
