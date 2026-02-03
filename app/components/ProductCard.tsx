"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Product } from "@/app/lib/types";
import { useCart } from "@/app/context/cart-context";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inCart) {
      setIsAdding(true);
      addToCart(product, 1);
      setTimeout(() => setIsAdding(false), 300);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="card group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-(--color-bg-secondary)">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="badge badge-secondary text-xs">New</span>
            )}
            {product.isBestseller && (
              <span className="badge badge-primary text-xs">Bestseller</span>
            )}
            {discount > 0 && (
              <span className="badge bg-(--color-error) text-white text-xs">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isWishlisted
                  ? "bg-(--color-primary) text-white"
                  : "bg-white/90 text-(--color-text-secondary) hover:text-(--color-primary)"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* Add to Cart Button - Mobile always visible, Desktop on hover */}
          <div className="absolute bottom-3 left-3 right-3 md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`w-full btn text-xs py-2 ${
                inCart ? "bg-(--color-secondary) text-white" : "btn-primary"
              } ${isAdding ? "animate-scale-in" : ""}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {inCart ? "In Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Category */}
          <p className="text-[10px] sm:text-xs text-(--color-text-muted) uppercase tracking-wide mb-1">
            {product.category}
          </p>

          {/* Title */}
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-1.5 group-hover:text-(--color-primary) transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? "text-(--color-warning) fill-current"
                      : "text-(--color-border)"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-(--color-text-muted)">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base sm:text-lg">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-(--color-text-muted) line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
