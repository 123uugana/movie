"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AppChrome({ children }) {
  const pathname = usePathname();

  if (pathname === "/signup" || pathname === "/sign-up") {
    return children;
  }

  return (
    <div className="app-shell">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
