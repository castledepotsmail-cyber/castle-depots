import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Castle Depots | Trends Collection",
  description: "Digital Department Store for Hardware and Trends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-bg-light text-text-main`}
      >
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
