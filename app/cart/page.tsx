"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/app/context/cart-context";

export default function CartPage() {
  const { cart, items, updateQuantity, removeFromCart, clearCart } = useCart();
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - cart.subtotal,
  );

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-(--color-bg-secondary) flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-(--color-text-muted)" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Your Cart is Empty</h1>
          <p className="text-(--color-text-secondary) mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-8">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <div className="bg-(--color-secondary-light) rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5 text-(--color-secondary)" />
            <span className="text-sm">
              Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more
              for free shipping!
            </span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-(--color-secondary) transition-all"
              style={{
                width: `${Math.min(100, (cart.subtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 bg-white rounded-lg border border-(--color-border-light) group"
            >
              {/* Product Image */}
              <Link
                href={`/product/${item.product.slug}`}
                className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-(--color-bg-secondary)"
              >
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-medium text-sm sm:text-base line-clamp-2 hover:text-(--color-primary) transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-(--color-text-muted) mt-1">
                      {item.product.category}
                    </p>
                    {item.selectedVariants &&
                      Object.entries(item.selectedVariants).length > 0 && (
                        <p className="text-xs text-(--color-text-secondary) mt-1">
                          {Object.entries(item.selectedVariants)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")}
                        </p>
                      )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-(--color-text-muted) hover:text-(--color-error) transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                    aria-label="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-end justify-between mt-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-(--color-border) rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="p-2 text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) transition-colors rounded-l-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm font-medium min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="p-2 text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-bg-secondary) transition-colors rounded-r-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-(--color-text-muted)">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="text-sm text-(--color-text-muted) hover:text-(--color-error) transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-lg border border-(--color-border-light) p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-(--color-text-secondary)">Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--color-text-secondary)">Shipping</span>
                <span
                  className={
                    cart.shipping === 0 ? "text-(--color-success)" : ""
                  }
                >
                  {cart.shipping === 0
                    ? "Free"
                    : `$${cart.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--color-text-secondary)">Tax</span>
                <span>${cart.tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-(--color-border) my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn btn-primary w-full mt-6 py-3">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products"
              className="block text-center text-sm text-(--color-text-secondary) hover:text-(--color-primary) mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
