import ProductCard from "./components/ProductCard";
import CategoryTabs from "./components/CategoryTabs";
import { products, getBestsellers, getNewProducts } from "./lib/data";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import Link from "next/link";

// Trust badges data
const trustBadges = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: Shield, title: "Secure Payment", desc: "100% protected" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day returns" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export default function Home() {
  const bestsellers = getBestsellers();
  const newArrivals = getNewProducts();

  return (
    <div>
      {/* Category Tabs */}
      <CategoryTabs activeCategory="all" />

      {/* Trust Badges - Compact Strip */}
      <div className="bg-(--color-primary-light) border-b border-(--color-border-light)">
        <div className="container py-4">
          <div className="flex justify-between items-center gap-6 overflow-x-auto no-scrollbar">
            {trustBadges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <badge.icon className="w-5 h-5 text-(--color-primary)" />
                <span className="text-sm font-medium text-(--color-text)">
                  {badge.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Products Grid */}
      <section className="container py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">All Products</h1>
            <p className="text-sm text-(--color-text-secondary) mt-1">
              {products.length} premium products for your cat
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm text-(--color-primary) hover:underline font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="product-grid">
          {products.slice(0, 8).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/products" className="btn btn-secondary">
            Browse All Products
          </Link>
        </div>
      </section>

      {/* Bestsellers Section */}
      {bestsellers.length > 0 && (
        <section className="bg-(--color-bg-secondary) py-8 sm:py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Bestsellers
                </h2>
                <p className="text-sm text-(--color-text-secondary) mt-1">
                  Our most loved products
                </p>
              </div>
            </div>

            <div className="product-grid">
              {bestsellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="container py-8 sm:py-12">
        <div className="bg-linear-to-r from-(--color-primary) to-[#c96a52] rounded-2xl p-6 sm:p-10 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
            First Order Discount
          </h2>
          <p className="text-white/80 mb-5 text-sm sm:text-base max-w-lg mx-auto">
            Sign up for our newsletter and get 10% off your first purchase.
            Plus, be the first to know about new arrivals!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20"
            />
            <button className="btn bg-white text-(--color-primary) hover:bg-white/90 whitespace-nowrap">
              Get 10% Off
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container pb-8 sm:pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                New Arrivals
              </h2>
              <p className="text-sm text-(--color-text-secondary) mt-1">
                Fresh picks for your feline friend
              </p>
            </div>
          </div>

          <div className="product-grid">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
