"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import CategoryTabs from "@/app/components/CategoryTabs";
import { products, searchProducts } from "@/app/lib/data";
import { SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";

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

  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = searchQuery ? searchProducts(searchQuery) : [...products];

    // Apply filters
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result = result
          .filter((p) => p.isNew)
          .concat(result.filter((p) => !p.isNew));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, sortBy, priceRange, inStockOnly]);

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
                  setPriceRange([0, 100]);
                  setInStockOnly(false);
                }}
                className="btn btn-ghost text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
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
                setPriceRange([0, 100]);
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
