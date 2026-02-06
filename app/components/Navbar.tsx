"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ShoppingCart, Menu, X, Cat, Loader2 } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { categories } from "@/app/lib/data";
import { Product } from "@/app/lib/types";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { itemCount } = useCart();

  // Search products from API with debouncing
  const searchProducts = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/v1/products?search=${encodeURIComponent(query)}&limit=6`,
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.products || []);
        setShowResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input change with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        searchProducts(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, searchProducts]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setShowResults(false);
    }
  };

  const handleResultClick = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  const SearchResultsDropdown = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-(--color-border) overflow-hidden z-50 max-h-[400px] overflow-y-auto">
      {isSearching ? (
        <div className="p-4 flex items-center justify-center gap-2 text-sm text-(--color-text-muted)">
          <Loader2 className="w-4 h-4 animate-spin" />
          Searching...
        </div>
      ) : searchResults.length > 0 ? (
        <>
          {searchResults.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={handleResultClick}
              className="flex items-center gap-3 p-3 hover:bg-(--color-bg-secondary) transition-colors border-b border-(--color-border-light) last:border-b-0"
            >
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-(--color-bg-secondary) shrink-0">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-(--color-text) truncate">
                  {product.name}
                </p>
                <p className="text-xs text-(--color-text-muted) truncate">
                  {product.category}
                </p>
              </div>
              <span className="text-sm font-semibold text-(--color-primary)">
                ${product.price.toFixed(2)}
              </span>
            </Link>
          ))}
          {searchQuery.trim() && (
            <Link
              href={`/products?search=${encodeURIComponent(searchQuery)}`}
              onClick={handleResultClick}
              className="block text-center py-3 text-sm text-(--color-primary) hover:bg-(--color-bg-secondary) font-medium border-t border-(--color-border-light)"
            >
              View all results for &quot;{searchQuery}&quot;
            </Link>
          )}
        </>
      ) : (
        <div className="p-4 text-center text-sm text-(--color-text-muted)">
          No products found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );

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
            <div className="hidden sm:block relative" ref={searchRef}>
              {isSearchOpen ? (
                <div className="relative animate-fade-in">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() =>
                        searchQuery.length >= 2 && setShowResults(true)
                      }
                      placeholder="Search products..."
                      className="input w-48 lg:w-64 pr-8 text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setShowResults(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-(--color-text-muted) hover:text-(--color-text)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                  {showResults && searchQuery.length >= 2 && (
                    <SearchResultsDropdown />
                  )}
                </div>
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
            <div className="mb-4 relative" ref={mobileSearchRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted)" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() =>
                      searchQuery.length >= 2 && setShowResults(true)
                    }
                    placeholder="Search products..."
                    className="input pl-11! text-sm"
                  />
                </div>
              </form>
              {showResults && searchQuery.length >= 2 && (
                <SearchResultsDropdown />
              )}
            </div>

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
