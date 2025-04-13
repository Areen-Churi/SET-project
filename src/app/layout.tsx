"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "../components/Navigation";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import FinanceContextProvider from "@/lib/store/finance-context";
import AuthContextProvider from "@/lib/store/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Finance Tracker</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContextProvider>
          <FinanceContextProvider>
            <ToastContainer />
              <Nav />
              {children}
          </FinanceContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
