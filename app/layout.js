import "./globals.css";
import Navbar from "@/components/Navbar";
export default function RootLayout({ children }) {
  return (
    <html data-theme="winter" lang="en">
      <body className="min-h-screen">
        <Navbar loggedIn={false} />
        {children}
      </body>
    </html>
  );
}
