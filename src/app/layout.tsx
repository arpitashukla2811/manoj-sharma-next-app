import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import { AuthProvider } from "./components/AuthContext";
import { CartProvider } from "./components/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manoj Kumar Sharma - Author",
  description: "Explore the literary works of Manoj Kumar Sharma, featuring author, prose, and spiritual reflections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
