"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingCart, Menu, X, Cat } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { categories } from "@/app/lib/data";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-(--color-border-light)">
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-(--color-primary) flex items-center justify-center transition-transform group-hover:scale-105">
              <Cat className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">
              Whisker&apos;s Haven
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="px-3 py-2 text-sm text-(--color-text-secondary) hover:text-(--color-text) transition-colors rounded-md hover:bg-(--color-bg-secondary)"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <div className="hidden sm:block">
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="relative animate-fade-in"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input w-48 lg:w-64 pr-8 text-sm"
                    autoFocus
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-(--color-text-muted) hover:text-(--color-text)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) rounded-full transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-xs font-medium bg-(--color-primary) text-white rounded-full flex items-center justify-center animate-scale-in">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:hidden text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) rounded-full transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-(--color-border-light) animate-slide-up">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted)" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input pl-10 text-sm"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2.5 text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) rounded-md transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
