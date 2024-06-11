import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LocalizationProvider from "@/locales/localization-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LocalizationProvider>
          <Toaster containerStyle={{ fontWeight: 500 }} />
          {children}
        </LocalizationProvider>
      </body>
    </html>
  );
}
