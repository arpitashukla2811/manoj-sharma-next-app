"use client";
import { usePathname } from 'next/navigation';
import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";
import { Toaster } from 'react-hot-toast';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && <Header />}
        <main className="flex-grow">{children}</main>
        {!isAdminRoute && <Footer />}
        <CartSidebar />
      </div>
    </>
  );
} 