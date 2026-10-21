import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar({ searchTerm, onSearchChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.05] bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2.5" aria-label="ShopEase home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">S</span>
          <span className="text-xl font-bold tracking-[-0.04em] text-ink">ShopEase<span className="text-brand">.</span></span>
        </Link>

        <label className="hidden max-w-sm flex-1 items-center gap-2.5 rounded-full border border-black/[0.07] bg-white px-4 py-2.5 text-muted transition focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/10 md:flex">
          <SearchIcon />
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </label>

        <nav
          aria-label="Main navigation"
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-1 border-b border-black/[0.06] bg-canvas px-5 pb-4 pt-2 shadow-sm md:static md:flex md:flex-row md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <Link to="/" onClick={closeMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:text-brand">Home</Link>
          <Link to="/categories" onClick={closeMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-brand">Categories</Link>
          <Link to="/products" onClick={closeMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-brand">Products</Link>
          <Link to="/cart" onClick={closeMenu} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-brand">
            Cart
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white" aria-label={`${cartCount} items in cart`}>
              {cartCount}
            </span>
          </Link>
          <Link to="/login" onClick={closeMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-brand">Login</Link>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.07] text-ink md:hidden"
        >
          <span className="text-xl leading-none" aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>
      <div className="px-5 pb-3 md:hidden">
        <label className="flex items-center gap-2.5 rounded-full border border-black/[0.07] bg-white px-4 py-2.5 text-muted">
          <SearchIcon />
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </label>
      </div>
    </header>
  );
}
