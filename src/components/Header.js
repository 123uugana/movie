import Link from "next/link";
import { Suspense } from "react";
import Logo from "./Logo";
import HeaderSearch from "./HeaderSearch";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="logo">
        <Logo />
      </Link>

      <nav className="top-nav">
        <Link href="/genres" className="genre-select">
         ⌄ Genre
        </Link>
        <Suspense fallback={<div className="header-search" />}>
          <HeaderSearch />
        </Suspense>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
