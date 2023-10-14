import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthContextProvider } from "@/utils/AuthContextProvider";
export default function Layout({ children }) {
  return (
    <html data-theme="winter" lang="en">
      <body className="min-h-screen">
        <AuthContextProvider>
          <Navbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
