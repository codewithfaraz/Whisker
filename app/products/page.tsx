"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import CategoryTabs from "@/app/components/CategoryTabs";
import { Product } from "@/app/lib/types";
import {
  SlidersHorizontal,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build sort params for API
      let sortByParam = "createdAt";
      let sortOrderParam = "desc";

      switch (sortBy) {
        case "newest":
          sortByParam = "createdAt";
          sortOrderParam = "desc";
          break;
        case "price-asc":
          sortByParam = "price";
          sortOrderParam = "asc";
          break;
        case "price-desc":
          sortByParam = "price";
          sortOrderParam = "desc";
          break;
        case "rating":
          sortByParam = "rating";
          sortOrderParam = "desc";
          break;
        case "popular":
        default:
          sortByParam = "reviewCount";
          sortOrderParam = "desc";
      }

      const params = new URLSearchParams({
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
        limit: "100",
      });

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/v1/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply client-side filters
  const filteredProducts = products.filter((p) => {
    if (inStockOnly && !p.inStock) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  return (
    <div>
      <CategoryTabs activeCategory="all" />

      <div className="container py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              {searchQuery ? `Search: "${searchQuery}"` : "All Products"}
            </h1>
            <p className="text-sm text-(--color-text-secondary) mt-1">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={fetchProducts}
              disabled={isLoading}
              className="p-2 text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
              title="Refresh products"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-secondary text-sm ${showFilters ? "border-(--color-primary) text-(--color-primary)" : ""}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input pr-8 text-sm appearance-none cursor-pointer min-w-[160px]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-(--color-bg-secondary) rounded-lg p-4 mb-6 animate-slide-up">
            <div className="flex flex-wrap gap-6">
              {/* Price Range */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">
                  Price Range
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="input text-sm w-20"
                    placeholder="Min"
                    min={0}
                  />
                  <span className="text-(--color-text-muted)">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="input text-sm w-20"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* In Stock */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-(--color-border) text-(--color-primary) focus:ring-(--color-primary)"
                />
                <label htmlFor="inStock" className="text-sm">
                  In Stock Only
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setPriceRange([0, 500]);
                  setInStockOnly(false);
                }}
                className="btn btn-ghost text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-(--color-primary) mb-4" />
            <p className="text-(--color-text-secondary)">Loading products...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-10 h-10 text-(--color-error) mb-4" />
            <p className="text-(--color-text-secondary) mb-4">{error}</p>
            <button onClick={fetchProducts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-(--color-text-secondary) mb-4">
              No products found matching your criteria.
            </p>
            <button
              onClick={() => {
                setPriceRange([0, 500]);
                setInStockOnly(false);
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-32 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-(--color-primary) mb-4" />
          <p className="text-(--color-text-secondary)">Loading products...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
