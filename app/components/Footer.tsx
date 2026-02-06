"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cat,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { categories } from "@/app/lib/data";
import { toast } from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
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
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setShowThankYou(true);
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {/* <div className="flex gap-3">
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
            </div> */}
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
                <Link
                  href="/about"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-medium mb-4">Newsletter</h3>
            <p className="text-sm text-(--color-text-secondary) mb-4">
              Get 10% off your first order and stay updated with new arrivals.
            </p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted)" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="input pl-11! text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary whitespace-nowrap min-w-[70px] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Join"
                )}
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
    </footer>
  );
}
