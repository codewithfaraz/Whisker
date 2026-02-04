import mongoose, { Schema, Model } from "mongoose";

// Variant Option Schema
const VariantOptionSchema = new Schema({
  value: { type: String, required: true },
  priceModifier: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
});

// Product Variant Schema
const ProductVariantSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["size", "color", "flavor"],
    required: true,
  },
  options: [VariantOptionSchema],
});

// Product Interface
export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  imagePublicIds?: string[];
  category: string;
  categorySlug: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  variants?: {
    name: string;
    type: "size" | "color" | "flavor";
    options: {
      value: string;
      priceModifier?: number;
      inStock: boolean;
    }[];
  }[];
  features?: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxLength: [300, "Short description cannot exceed 300 characters"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    imagePublicIds: [String],
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    categorySlug: {
      type: String,
      required: true,
      lowercase: true,
    },
    tags: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    variants: [ProductVariantSchema],
    features: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Create slug from name and set inStock based on stockCount before saving
ProductSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Automatically set inStock based on stockCount
  if (this.isModified("stockCount") || this.isNew) {
    this.inStock = this.stockCount > 0;
  }
});

// Create indexes for better query performance
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ categorySlug: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ createdAt: -1 });

// Prevent model recompilation in development
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
