"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ProductCard from "./components/ProductCard";
import CategoryTabs from "./components/CategoryTabs";
import { Product } from "./lib/types";
import { categories } from "./lib/data";
import {
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  ArrowRight,
  Cat,
  CheckCircle2,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Trust badges data
const trustBadges = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: Shield, title: "Secure Payment", desc: "100% protected" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day returns" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

// Hero slides data
const heroSlides = [
  {
    id: 1,
    title: "Premium Cat Nutrition",
    subtitle: "Healthy & Delicious Meals",
    description:
      "Give your feline the nutrition they deserve with our organic, vet-approved food selection.",
    cta: "Shop Food & Treats",
    link: "/products/food-treats",
    bgColor: "from-amber-50 to-orange-100",
    accentColor: "bg-amber-500",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Playful Adventures",
    subtitle: "Interactive Toys Collection",
    description:
      "Keep your cat entertained for hours with our smart, engaging toys designed for curious minds.",
    cta: "Explore Toys",
    link: "/products/toys",
    bgColor: "from-rose-50 to-pink-100",
    accentColor: "bg-rose-500",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Cozy Cat Furniture",
    subtitle: "Rest & Relaxation",
    description:
      "From luxury beds to towering cat trees, create the perfect sanctuary for your furry friend.",
    cta: "Shop Furniture",
    link: "/products/beds-furniture",
    bgColor: "from-blue-50 to-indigo-100",
    accentColor: "bg-blue-500",
    image:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop",
  },
];

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredScrollPos, setFeaturedScrollPos] = useState(0);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Subscription state
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Auto-close Thank You modal
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showThankYou]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setShowThankYou(true);
        setSubscribeEmail("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allResponse = await fetch(
        "/api/v1/products?limit=12&sortBy=createdAt&sortOrder=desc",
      );
      const allData = await allResponse.json();

      if (allData.success) {
        setAllProducts(allData.products || []);

        // Featured products (isFeatured flag)
        const featured = allData.products
          .filter((p: Product) => p.isFeatured)
          .slice(0, 8);
        setFeaturedProducts(
          featured.length > 0 ? featured : allData.products.slice(0, 6),
        );

        // Bestsellers
        const bestsellerProducts = allData.products
          .filter((p: Product) => p.isBestseller || p.reviewCount > 10)
          .slice(0, 4);
        setBestsellers(bestsellerProducts);

        // New arrivals
        const newProducts = allData.products
          .filter((p: Product) => p.isNew || p.isNewArrival)
          .slice(0, 4);
        setNewArrivals(newProducts);
      } else {
        setError(allData.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const scrollFeatured = (direction: "left" | "right") => {
    if (featuredRef.current) {
      const scrollAmount = 320;
      const newPos =
        direction === "left"
          ? Math.max(0, featuredScrollPos - scrollAmount)
          : featuredScrollPos + scrollAmount;
      featuredRef.current.scrollTo({ left: newPos, behavior: "smooth" });
      setFeaturedScrollPos(newPos);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-(--color-primary)/10 flex items-center justify-center mb-4 animate-pulse">
          <Cat className="w-8 h-8 text-(--color-primary)" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-(--color-primary) mb-3" />
        <p className="text-(--color-text-secondary)">Loading Whisker...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <CategoryTabs activeCategory="all" />
        <div className="container py-32 flex flex-col items-center justify-center">
          <AlertCircle className="w-10 h-10 text-(--color-error) mb-4" />
          <p className="text-(--color-text-secondary) mb-4">{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activeSlide = heroSlides[currentSlide];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Banner Slider */}
      <section
        className={`relative bg-linear-to-br ${activeSlide.bgColor} transition-all duration-700`}
      >
        <div className="container pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${activeSlide.accentColor} text-white text-sm font-medium mb-4`}
              >
                <Sparkles className="w-4 h-4" />
                {activeSlide.subtitle}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--color-text) mb-4 leading-tight">
                {activeSlide.title}
              </h1>
              <p className="text-(--color-text-secondary) text-base sm:text-lg mb-6 max-w-md mx-auto lg:mx-0">
                {activeSlide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href={activeSlide.link}
                  className="btn btn-primary text-base px-6 py-3"
                >
                  {activeSlide.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/products"
                  className="btn btn-secondary text-base px-6 py-3"
                >
                  View All Products
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-linear-to-br from-white/50 to-transparent rounded-3xl" />
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 bg-white rounded-2xl shadow-lg p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-(--color-primary)/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-(--color-primary) fill-current" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-(--color-text)">
                        Top Rated
                      </p>
                      <p className="text-xs text-(--color-text-muted)">
                        By Pet Lovers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="pb-4 flex justify-center lg:justify-start gap-2 mt-8">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide
                    ? "w-8 bg-(--color-primary)"
                    : "bg-(--color-text-muted)/30 hover:bg-(--color-text-muted)/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      {/* <CategoryTabs activeCategory="all" /> */}

      {/* Trust Badges */}
      <div className="mt-4 border-(--color-border-light)">
        <div className="container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trustBadges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-(--color-bg-secondary) rounded-xl hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-(--color-primary)/10 flex items-center justify-center shrink-0">
                  <badge.icon className="w-5 h-5 text-(--color-primary)" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-(--color-text) truncate">
                    {badge.title}
                  </p>
                  <p className="text-xs text-(--color-text-muted) truncate">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <section className="mt-4 container py-10 sm:py-14">
          <div className="mt-4 flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Featured Products
              </h2>
              <p className="text-sm text-(--color-text-secondary) mt-1">
                Hand-picked favorites for your feline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollFeatured("left")}
                className="p-2.5 rounded-full border border-(--color-border) hover:bg-(--color-bg-secondary) transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollFeatured("right")}
                className="p-2.5 rounded-full border border-(--color-border) hover:bg-(--color-bg-secondary) transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={featuredRef}
            className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
            onScroll={(e) => setFeaturedScrollPos(e.currentTarget.scrollLeft)}
          >
            {featuredProducts.map((product, idx) => (
              <div key={product.id} className="shrink-0 w-[280px]">
                <ProductCard product={product} priority={idx < 3} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Showcase */}
      <section className="bg-(--color-bg-secondary) py-10 sm:py-14">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Shop by Category
            </h2>
            <p className="text-sm text-(--color-text-secondary) mt-1">
              Find exactly what your cat needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories
              .filter((c) => c.slug !== "all")
              .slice(0, 5)
              .map((category) => (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}`}
                  className="group relative bg-white rounded-2xl p-5 text-center hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-linear-to-br from-(--color-primary)/10 to-(--color-primary)/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-3xl">
                      {category.icon === "utensils"
                        ? "🍖"
                        : category.icon === "sparkles"
                          ? "🎾"
                          : category.icon === "home"
                            ? "🛏️"
                            : category.icon === "tag"
                              ? "✨"
                              : "❤️"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-(--color-text) group-hover:text-(--color-primary) transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-(--color-text-muted) mt-1">
                    {category.productCount}+ items
                  </p>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-(--color-primary)/20 rounded-2xl transition-colors" />
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="container py-10 sm:py-14">
        <div className="mt-4 flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Latest Products
            </h2>
            <p className="text-sm text-(--color-text-secondary) mt-1">
              {allProducts.length} premium products available
            </p>
          </div>
          <Link href="/products" className="btn btn-secondary text-sm">
            View All →
          </Link>
        </div>

        {allProducts.length > 0 ? (
          <div className="product-grid">
            {allProducts.slice(0, 8).map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-(--color-bg-secondary) rounded-2xl">
            <Cat className="w-16 h-16 mx-auto text-(--color-text-muted) mb-4" />
            <p className="text-(--color-text-secondary) mb-4">
              No products yet. Add some from the dashboard!
            </p>
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="container pb-10 sm:pb-14">
        <div className="relative bg-linear-to-r from-(--color-primary) to-[#c96a52] rounded-3xl p-8 sm:p-12 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/4 translate-y-1/4" />
          </div>

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4">
                🎉 Limited Time Offer
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Get 15% Off Your First Order
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-6">
                Join our newsletter for exclusive deals, new product
                announcements, and cat care tips!
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <input
                  type="email"
                  required
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-white text-(--color-primary) font-semibold hover:bg-white/90 transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-white/10 rounded-3xl" />
              <div className="relative aspect-video rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop"
                  alt="Happy cat"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="bg-(--color-bg-secondary) py-10 sm:py-14">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                  <Star className="w-7 h-7 text-amber-500 fill-current" />
                  Bestsellers
                </h2>
                <p className="text-sm text-(--color-text-secondary) mt-1">
                  Top picks loved by cat parents
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

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="container py-10 sm:py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-(--color-primary)" />
                New Arrivals
              </h2>
              <p className="text-sm text-(--color-text-secondary) mt-1">
                Fresh additions to our collection
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

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowThankYou(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <button
              onClick={() => setShowThankYou(false)}
              className="absolute top-4 right-4 text-(--color-text-muted) hover:text-(--color-text) transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-(--color-text) mb-2">
              You're on the list!
            </h3>
            <p className="text-(--color-text-secondary)">
              Thank you for subscribing to our newsletter. We'll be in touch
              with cat-tastic updates soon!
            </p>
          </div>
        </div>
      )}

      {/* Add floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
