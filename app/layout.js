import "./globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { AuthContextProvider } from "@/utils/AuthContextProvider";
import { Toaster } from "react-hot-toast";
export default function Layout({ children }) {
  return (
    <html data-theme="winter" lang="en">
      <Head>
        <title>Blog CMS</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
