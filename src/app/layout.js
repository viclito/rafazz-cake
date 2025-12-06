'use client';
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AuthProvider from "@/components/AuthProvider";
import { CartProvider } from "@/context/CartContext";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable}`}>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider>
              {!isAdminRoute && <Header />}
              {children}
              {!isAdminRoute && <Footer />}
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
