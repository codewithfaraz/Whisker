"use client";

import Link from "next/link";
import { Cat, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { categories } from "@/app/lib/data";

export default function Footer() {
  return (
    <footer className="bg-(--color-bg-secondary) border-t border-(--color-border-light) mt-16 pt-4">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-(--color-primary) flex items-center justify-center">
                <Cat className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">
                Whisker&apos;s Haven
              </span>
            </Link>
            <p className="text-sm text-(--color-text-secondary) mb-4">
              Premium products for your beloved feline companions. Quality,
              comfort, and style for every cat.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-(--color-surface) border border-(--color-border) flex items-center justify-center text-(--color-text-secondary) hover:text-(--color-primary) hover:border-(--color-primary) transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-(--color-surface) border border-(--color-border) flex items-center justify-center text-(--color-text-secondary) hover:text-(--color-primary) hover:border-(--color-primary) transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-(--color-surface) border border-(--color-border) flex items-center justify-center text-(--color-text-secondary) hover:text-(--color-primary) hover:border-(--color-primary) transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-medium mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categories.slice(1).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-medium mb-4">Newsletter</h3>
            <p className="text-sm text-(--color-text-secondary) mb-4">
              Get 10% off your first order and stay updated with new arrivals.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted)" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="input pl-10 text-sm"
                />
              </div>
              <button className="btn btn-primary whitespace-nowrap">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-(--color-border) flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-(--color-text-muted)">
            © 2024 Whisker&apos;s Haven. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-(--color-text-muted)">
              Payment Methods:
            </span>
            <div className="flex gap-2 text-xs text-(--color-text-secondary)">
              <span className="px-2 py-1 bg-(--color-surface) rounded border border-(--color-border)">
                Visa
              </span>
              <span className="px-2 py-1 bg-(--color-surface) rounded border border-(--color-border)">
                MC
              </span>
              <span className="px-2 py-1 bg-(--color-surface) rounded border border-(--color-border)">
                PayPal
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
