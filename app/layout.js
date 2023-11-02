import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthContextProvider } from "@/utils/AuthContextProvider";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import QueryProvider from "@/utils/QueryProvider";

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
        <QueryProvider>
          <AuthContextProvider>
            <Navbar />
            {children}
          </AuthContextProvider>
          <Toaster position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
