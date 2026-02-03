"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
} from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  getProductReviews,
} from "@/app/lib/data";
import { useCart } from "@/app/context/cart-context";
import ProductCard from "@/app/components/ProductCard";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id: slug } = use(params);
  const product = getProductBySlug(slug);
  const { addToCart, isInCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "shipping"
  >("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
        <Link href="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product, 4);
  const reviews = getProductReviews(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
  };

  const handleVariantChange = (variantId: string, optionValue: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantId]: optionValue }));
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6 overflow-x-auto no-scrollbar">
        <Link
          href="/"
          className="text-(--color-text-muted) hover:text-(--color-primary) whitespace-nowrap"
        >
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-(--color-text-muted) shrink-0" />
        <Link
          href="/products"
          className="text-(--color-text-muted) hover:text-(--color-primary) whitespace-nowrap"
        >
          Products
        </Link>
        <ChevronRight className="w-4 h-4 text-(--color-text-muted) shrink-0" />
        <Link
          href={`/products/${product.categorySlug}`}
          className="text-(--color-text-muted) hover:text-(--color-primary) whitespace-nowrap"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-4 h-4 text-(--color-text-muted) shrink-0" />
        <span className="text-(--color-text) truncate">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-(--color-bg-secondary)">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="badge badge-secondary">New</span>
              )}
              {product.isBestseller && (
                <span className="badge badge-primary">Bestseller</span>
              )}
              {discount > 0 && (
                <span className="badge bg-(--color-error) text-white">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx
                      ? "border-(--color-primary)"
                      : "border-transparent hover:border-(--color-border)"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Category */}
          <Link
            href={`/products/${product.categorySlug}`}
            className="text-sm text-(--color-text-muted) hover:text-(--color-primary)"
          >
            {product.category}
          </Link>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-semibold mt-2 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-(--color-warning) fill-current"
                      : "text-(--color-border)"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-(--color-text-secondary)">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-(--color-text-muted) line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-(--color-text-secondary) mb-6">
            {product.shortDescription}
          </p>

          {/* Variants */}
          {product.variants &&
            product.variants.map((variant) => (
              <div key={variant.id} className="mb-5">
                <label className="block text-sm font-medium mb-2">
                  {variant.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleVariantChange(variant.id, option.value)
                      }
                      disabled={!option.inStock}
                      className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                        selectedVariants[variant.id] === option.value
                          ? "border-(--color-primary) bg-(--color-primary-light) text-(--color-primary)"
                          : option.inStock
                            ? "border-(--color-border) hover:border-(--color-primary)"
                            : "border-(--color-border) bg-(--color-bg-secondary) text-(--color-text-muted) cursor-not-allowed line-through"
                      }`}
                    >
                      {option.value}
                      {option.priceModifier &&
                        option.priceModifier > 0 &&
                        ` (+$${option.priceModifier})`}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Quantity */}
            <div className="flex items-center border border-(--color-border) rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 btn py-3 ${
                inCart ? "btn-secondary" : "btn-primary"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {inCart ? "Add More" : "Add to Cart"}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 rounded-lg border transition-colors ${
                isWishlisted
                  ? "bg-(--color-primary) text-white border-(--color-primary)"
                  : "border-(--color-border) hover:border-(--color-primary) hover:text-(--color-primary)"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* Stock Status */}
          <p
            className={`text-sm mb-6 ${product.inStock ? "text-(--color-success)" : "text-(--color-error)"}`}
          >
            {product.inStock
              ? `✓ In Stock ${product.stockCount ? `(${product.stockCount} available)` : ""}`
              : "✕ Out of Stock"}
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-(--color-bg-secondary) rounded-lg">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-5 h-5 text-(--color-primary) mb-1" />
              <span className="text-xs text-(--color-text-secondary)">
                Free Shipping
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-5 h-5 text-(--color-primary) mb-1" />
              <span className="text-xs text-(--color-text-secondary)">
                30-Day Returns
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-5 h-5 text-(--color-primary) mb-1" />
              <span className="text-xs text-(--color-text-secondary)">
                Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-12">
        {/* Tab Headers */}
        <div className="flex border-b border-(--color-border) mb-6">
          {(["description", "reviews", "shipping"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${
                activeTab === tab
                  ? "border-(--color-primary) text-(--color-primary)"
                  : "border-transparent text-(--color-text-secondary) hover:text-(--color-text)"
              }`}
            >
              {tab} {tab === "reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "description" && (
            <div className="prose prose-sm max-w-none">
              <p className="text-(--color-text-secondary) mb-4">
                {product.description}
              </p>
              {product.features && (
                <div>
                  <h3 className="font-medium mb-3">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-(--color-text-secondary)"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary)" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-(--color-border-light) pb-6 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <span className="badge badge-secondary text-xs">
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-(--color-text-muted)">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "text-(--color-warning) fill-current"
                                : "text-(--color-border)"
                            }`}
                          />
                        ))}
                      </div>
                      <h4 className="font-medium text-sm mb-1">
                        {review.title}
                      </h4>
                      <p className="text-sm text-(--color-text-secondary)">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-(--color-text-secondary) text-center py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4 text-sm text-(--color-text-secondary)">
              <div>
                <h4 className="font-medium text-(--color-text) mb-2">
                  Shipping
                </h4>
                <p>
                  Free standard shipping on orders over $50. Orders typically
                  ship within 1-2 business days.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-(--color-text) mb-2">
                  Delivery
                </h4>
                <p>
                  Standard delivery: 5-7 business days. Express delivery: 2-3
                  business days (additional charges apply).
                </p>
              </div>
              <div>
                <h4 className="font-medium text-(--color-text) mb-2">
                  Returns
                </h4>
                <p>
                  We offer a 30-day return policy on all unopened items. Please
                  contact support for assistance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-6">You May Also Like</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
