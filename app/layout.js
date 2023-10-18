import "./globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { AuthContextProvider } from "@/utils/AuthContextProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Blog CMS",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    charset: "UTF-8",
  },
};

export default function Layout({ children }) {
  return (
    <html data-theme="winter" lang="en">
      <body className="min-h-screen">
        <AuthContextProvider>
          <Navbar />
          {children}
        </AuthContextProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
