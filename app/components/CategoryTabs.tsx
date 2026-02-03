"use client";

import Link from "next/link";
import {
  UtensilsCrossed,
  Sparkles,
  Home,
  Tag,
  Heart,
  LayoutGrid,
} from "lucide-react";
import { categories } from "@/app/lib/data";

const iconMap: { [key: string]: React.ReactNode } = {
  grid: <LayoutGrid className="w-5 h-5" />,
  utensils: <UtensilsCrossed className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  tag: <Tag className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
};

interface CategoryTabsProps {
  activeCategory?: string;
}

export default function CategoryTabs({
  activeCategory = "all",
}: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-40 bg-white border-b border-(--color-border-light)">
      <div className="container">
        <div className="flex overflow-x-auto no-scrollbar py-3 gap-2 sm:gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            return (
              <Link
                key={category.id}
                href={
                  category.slug === "all"
                    ? "/products"
                    : `/products/${category.slug}`
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  isActive
                    ? "bg-(--color-primary) text-white shadow-md"
                    : "bg-(--color-bg-secondary) text-(--color-text-secondary) hover:bg-(--color-border) hover:text-(--color-text)"
                }`}
              >
                {category.icon && iconMap[category.icon]}
                <span>{category.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-(--color-surface) text-(--color-text-muted)"
                  }`}
                >
                  {category.productCount}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
