"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Package,
  ShoppingBag,
  Plus,
  X,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { categories } from "@/app/lib/data";
import { Product, Order } from "@/app/lib/types";
import toast from "react-hot-toast";

// Mock orders data (will be replaced with API later)
const mockOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-2024-001",
    productId: "prod-1",
    productName: "Organic Salmon Feast",
    productImage: "https://picsum.photos/seed/order1/100/100",
    quantity: 2,
    unitPrice: 24.99,
    totalPrice: 49.98,
    purchaserName: "John Smith",
    purchaserEmail: "john@example.com",
    status: "delivered",
    orderDate: "2024-01-15",
    shippingAddress: "123 Cat Street, Pet City, PC 12345",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2024-002",
    productId: "prod-6",
    productName: "Interactive Feather Wand",
    productImage: "https://picsum.photos/seed/order2/100/100",
    quantity: 1,
    unitPrice: 15.99,
    totalPrice: 15.99,
    purchaserName: "Sarah Johnson",
    purchaserEmail: "sarah@example.com",
    status: "shipped",
    orderDate: "2024-01-18",
    shippingAddress: "456 Whisker Ave, Meow Town, MT 67890",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2024-003",
    productId: "prod-11",
    productName: "Plush Donut Bed",
    productImage: "https://picsum.photos/seed/order3/100/100",
    quantity: 1,
    unitPrice: 39.99,
    totalPrice: 39.99,
    purchaserName: "Mike Wilson",
    purchaserEmail: "mike@example.com",
    status: "processing",
    orderDate: "2024-01-20",
    shippingAddress: "789 Paw Lane, Furry Hills, FH 11223",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-2024-004",
    productId: "prod-3",
    productName: "Freeze-Dried Liver Treats",
    productImage: "https://picsum.photos/seed/order4/100/100",
    quantity: 3,
    unitPrice: 12.99,
    totalPrice: 38.97,
    purchaserName: "Emily Davis",
    purchaserEmail: "emily@example.com",
    status: "pending",
    orderDate: "2024-01-22",
    shippingAddress: "321 Kitty Road, Catville, CV 44556",
  },
  {
    id: "ord-5",
    orderNumber: "ORD-2024-005",
    productId: "prod-19",
    productName: "Self-Cleaning Slicker Brush",
    productImage: "https://picsum.photos/seed/order5/100/100",
    quantity: 2,
    unitPrice: 16.99,
    totalPrice: 33.98,
    purchaserName: "David Brown",
    purchaserEmail: "david@example.com",
    status: "delivered",
    orderDate: "2024-01-10",
    shippingAddress: "654 Purr Street, Feline City, FC 77889",
  },
];

// Status badge colors
const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// New product form initial state
const initialProductForm = {
  name: "",
  price: "",
  originalPrice: "",
  shortDescription: "",
  description: "",
  category: "",
  stockCount: "",
  tags: "",
  features: "",
  images: [] as string[],
  inStock: true,
  isFeatured: false,
  isNew: false,
  isBestseller: false,
};

// Image with public ID for Cloudinary
interface ImageData {
  url: string;
  publicId: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states for actions
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to connect to the server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products based on search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter orders based on search
  const filteredOrders = mockOrders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.purchaserName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Stats
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => (p.stockCount || 0) < 20,
  ).length;
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const response = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          setUploadedImages((prev) => [
            ...prev,
            { url: data.image.url, publicId: data.image.publicId },
          ]);
        } else {
          toast.error(`Failed to upload ${file.name}: ${data.message}`);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      // Reset input
      e.target.value = "";
    }
  };

  // Remove uploaded image
  const handleRemoveImage = async (index: number) => {
    const image = uploadedImages[index];
    try {
      await fetch("/api/v1/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: image.publicId }),
      });
    } catch (err) {
      console.error("Error deleting image:", err);
    }
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit new product
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productForm.name,
          price: productForm.price,
          originalPrice: productForm.originalPrice || undefined,
          shortDescription: productForm.shortDescription,
          description: productForm.description,
          category: productForm.category,
          stockCount: productForm.stockCount,
          tags: productForm.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          features: productForm.features.split("\n").filter((f) => f.trim()),
          images: uploadedImages.map((img) => img.url),
          imagePublicIds: uploadedImages.map((img) => img.publicId),
          inStock: productForm.inStock,
          isFeatured: productForm.isFeatured,
          isNew: productForm.isNew,
          isBestseller: productForm.isBestseller,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Product created successfully!");
        setShowAddModal(false);
        setProductForm(initialProductForm);
        setUploadedImages([]);
        fetchProducts(); // Refresh product list
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit product - populate form with existing data
  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      shortDescription: product.shortDescription,
      description: product.description,
      category: product.categorySlug,
      stockCount: (product.stockCount || 0).toString(),
      tags: product.tags.join(", "),
      features: product.features?.join("\n") || "",
      images: [],
      inStock: product.inStock,
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      isBestseller: product.isBestseller || false,
    });
    // Set existing images
    setUploadedImages(
      product.images.map((url, i) => ({
        url,
        publicId:
          (product as unknown as { imagePublicIds?: string[] })
            .imagePublicIds?.[i] || "",
      })),
    );
    setEditProduct(product);
  };

  // Save edited product
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productForm.name,
          price: productForm.price,
          originalPrice: productForm.originalPrice || undefined,
          shortDescription: productForm.shortDescription,
          description: productForm.description,
          category: productForm.category,
          stockCount: productForm.stockCount,
          tags: productForm.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          features: productForm.features.split("\n").filter((f) => f.trim()),
          images: uploadedImages.map((img) => img.url),
          imagePublicIds: uploadedImages.map((img) => img.publicId),
          inStock: productForm.inStock,
          isFeatured: productForm.isFeatured,
          isNew: productForm.isNew,
          isBestseller: productForm.isBestseller,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Product updated successfully!");
        setEditProduct(null);
        setProductForm(initialProductForm);
        setUploadedImages([]);
        fetchProducts(); // Refresh product list
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/products/${deleteProduct.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Product "${deleteProduct.name}" deleted successfully!`);
        setDeleteProduct(null);
        fetchProducts(); // Refresh product list
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Manage your products and orders
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-(--color-border) p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProducts}</p>
              <p className="text-sm text-(--color-text-secondary)">
                Total Products
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-(--color-border) p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockProducts}</p>
              <p className="text-sm text-(--color-text-secondary)">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-(--color-border) p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="text-sm text-(--color-text-secondary)">
                Total Orders
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-(--color-border) p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingOrders}</p>
              <p className="text-sm text-(--color-text-secondary)">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-(--color-border) mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "products"
              ? "border-(--color-primary) text-(--color-primary)"
              : "border-transparent text-(--color-text-secondary) hover:text-(--color-text)"
          }`}
        >
          <Package className="w-4 h-4" />
          Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 -mb-1px transition-colors ${
            activeTab === "orders"
              ? "border-(--color-primary) text-(--color-primary)"
              : "border-transparent text-(--color-text-secondary) hover:text-(--color-text)"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Orders
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-text-muted) pointer-events-none" />
          <input
            type="text"
            placeholder={
              activeTab === "products"
                ? "Search products..."
                : "Search orders..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
        {activeTab === "products" && (
          <button
            onClick={fetchProducts}
            disabled={isLoading}
            className="btn btn-secondary flex items-center gap-2"
            title="Refresh products"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="bg-white rounded-xl border border-(--color-border) overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-(--color-primary)" />
              <span className="ml-3 text-(--color-text-secondary)">
                Loading products...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-500 font-medium mb-2">
                Error loading products
              </p>
              <p className="text-(--color-text-secondary) text-sm mb-4">
                {error}
              </p>
              <button onClick={fetchProducts} className="btn btn-primary">
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="w-12 h-12 text-(--color-text-muted) mb-4" />
              <p className="text-(--color-text-secondary) font-medium mb-2">
                No products yet
              </p>
              <p className="text-(--color-text-muted) text-sm mb-4">
                Add your first product to get started
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          )}

          {/* Products Table */}
          {!isLoading && !error && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-(--color-bg-secondary)">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                      Stock
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-border-light)">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-(--color-bg-secondary) transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-(--color-bg-secondary) shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-(--color-text-muted)">
                              {product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.category}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-(--color-text-muted) line-through ml-2">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-medium ${
                            (product.stockCount || 0) < 20
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stockCount || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            product.inStock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setViewProduct(product)}
                            className="p-2 hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-(--color-text-secondary)" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-(--color-text-secondary)" />
                          </button>
                          <button
                            onClick={() => setDeleteProduct(product)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-xl border border-(--color-border) overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-(--color-bg-secondary)">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                    Qty
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                    Unit Price
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-(--color-text-secondary)">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border-light)">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-(--color-bg-secondary) transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-(--color-text-muted)">
                          {order.orderDate}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-(--color-bg-secondary) shrink-0">
                          <Image
                            src={order.productImage}
                            alt={order.productName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm">{order.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">
                          {order.purchaserName}
                        </p>
                        <p className="text-xs text-(--color-text-muted)">
                          {order.purchaserEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{order.quantity}</td>
                    <td className="px-4 py-3 text-sm">
                      ${order.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full capitalize ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="p-2 hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
                          title="View Order"
                        >
                          <Eye className="w-4 h-4 text-(--color-text-secondary)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmitProduct} className="space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="input w-full"
                    placeholder="e.g., Organic Salmon Feast"
                  />
                </div>

                {/* Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="input w-full"
                      placeholder="24.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Original Price (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.originalPrice}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          originalPrice: e.target.value,
                        })
                      }
                      className="input w-full"
                      placeholder="29.99"
                    />
                  </div>
                </div>

                {/* Category & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                      className="input w-full"
                    >
                      <option value="">Select category</option>
                      {categories.slice(1).map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.stockCount}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stockCount: e.target.value,
                        })
                      }
                      className="input w-full"
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.shortDescription}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        shortDescription: e.target.value,
                      })
                    }
                    className="input w-full"
                    placeholder="Brief product description"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="input w-full resize-none"
                    placeholder="Detailed product description..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={productForm.tags}
                    onChange={(e) =>
                      setProductForm({ ...productForm, tags: e.target.value })
                    }
                    className="input w-full"
                    placeholder="organic, grain-free, salmon"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Features (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.features}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        features: e.target.value,
                      })
                    }
                    className="input w-full resize-none"
                    placeholder="Wild-caught salmon&#10;No artificial preservatives&#10;Rich in Omega-3"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Images *
                  </label>
                  <div className="border-2 border-dashed border-(--color-border) rounded-lg p-4 text-center hover:border-(--color-primary) transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                      id="add-image-upload"
                    />
                    <label
                      htmlFor="add-image-upload"
                      className={`cursor-pointer ${isUploadingImage ? "opacity-50" : ""}`}
                    >
                      {isUploadingImage ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 animate-spin text-(--color-primary) mb-2" />
                          <span className="text-sm text-(--color-text-secondary)">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-(--color-text-muted) mb-2" />
                          <span className="text-sm text-(--color-text-secondary)">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-(--color-text-muted) mt-1">
                            JPEG, PNG, WebP, GIF (max 5MB)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border border-(--color-border)"
                        >
                          <Image
                            src={img.url}
                            alt={`Product ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploadedImages.length === 0 && (
                    <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      At least one image is required
                    </p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          inStock: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-(--color-border)"
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-(--color-border)"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isNew: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-(--color-border)"
                    />
                    <span className="text-sm">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isBestseller}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isBestseller: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-(--color-border)"
                    />
                    <span className="text-sm">Bestseller</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setProductForm(initialProductForm);
                      setUploadedImages([]);
                    }}
                    disabled={isSubmitting}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isUploadingImage ||
                      uploadedImages.length === 0
                    }
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setViewProduct(null)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
              <h2 className="text-xl font-semibold">Product Details</h2>
              <button
                onClick={() => setViewProduct(null)}
                className="p-2 hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-(--color-bg-secondary) shrink-0">
                  <Image
                    src={viewProduct.images[0]}
                    alt={viewProduct.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{viewProduct.name}</h3>
                  <p className="text-sm text-(--color-text-muted)">
                    {viewProduct.category}
                  </p>
                  <p className="text-xl font-bold mt-1">
                    ${viewProduct.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">ID</span>
                  <span className="font-medium">{viewProduct.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">Stock</span>
                  <span className="font-medium">
                    {viewProduct.stockCount || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">Rating</span>
                  <span className="font-medium">
                    {viewProduct.rating} ({viewProduct.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">Status</span>
                  <span
                    className={`font-medium ${viewProduct.inStock ? "text-green-600" : "text-red-600"}`}
                  >
                    {viewProduct.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="py-2">
                  <p className="text-(--color-text-secondary) mb-1">
                    Description
                  </p>
                  <p className="text-(--color-text)">
                    {viewProduct.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setEditProduct(null);
              setProductForm(initialProductForm);
              setUploadedImages([]);
            }}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
              <h2 className="text-xl font-semibold">Edit Product</h2>
              <button
                onClick={() => {
                  setEditProduct(null);
                  setProductForm(initialProductForm);
                  setUploadedImages([]);
                }}
                className="p-2 hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSaveEdit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.stockCount}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stockCount: e.target.value,
                        })
                      }
                      className="input w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={productForm.shortDescription}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        shortDescription: e.target.value,
                      })
                    }
                    className="input w-full"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Images *
                  </label>
                  <div className="border-2 border-dashed border-(--color-border) rounded-lg p-4 text-center hover:border-(--color-primary) transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className={`cursor-pointer ${isUploadingImage ? "opacity-50" : ""}`}
                    >
                      {isUploadingImage ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 animate-spin text-(--color-primary) mb-2" />
                          <span className="text-sm text-(--color-text-secondary)">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-(--color-text-muted) mb-2" />
                          <span className="text-sm text-(--color-text-secondary)">
                            Click to upload more images
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border border-(--color-border)"
                        >
                          <Image
                            src={img.url}
                            alt={`Product ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          inStock: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditProduct(null);
                      setProductForm(initialProductForm);
                      setUploadedImages([]);
                    }}
                    disabled={isSubmitting}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      isUploadingImage ||
                      uploadedImages.length === 0
                    }
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteProduct(null)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Delete Product?</h2>
              <p className="text-sm text-(--color-text-secondary) mb-6">
                Are you sure you want to delete{" "}
                <strong>{deleteProduct.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteProduct(null)}
                  disabled={isSubmitting}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={isSubmitting}
                  className="btn bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setViewOrder(null)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                onClick={() => setViewOrder(null)}
                className="p-2 hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-(--color-border-light)">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-(--color-bg-secondary) shrink-0">
                  <Image
                    src={viewOrder.productImage}
                    alt={viewOrder.productName}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{viewOrder.productName}</h3>
                  <p className="text-sm text-(--color-text-muted)">
                    {viewOrder.orderNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">
                    Order Date
                  </span>
                  <span className="font-medium">{viewOrder.orderDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">Status</span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full capitalize ${statusColors[viewOrder.status]}`}
                  >
                    {viewOrder.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">
                    Quantity
                  </span>
                  <span className="font-medium">{viewOrder.quantity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">
                    Unit Price
                  </span>
                  <span className="font-medium">
                    ${viewOrder.unitPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-(--color-border-light)">
                  <span className="text-(--color-text-secondary)">Total</span>
                  <span className="font-bold text-lg">
                    ${viewOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="py-2 border-b border-(--color-border-light)">
                  <p className="text-(--color-text-secondary) mb-1">Customer</p>
                  <p className="font-medium">{viewOrder.purchaserName}</p>
                  <p className="text-(--color-text-muted)">
                    {viewOrder.purchaserEmail}
                  </p>
                </div>
                <div className="py-2">
                  <p className="text-(--color-text-secondary) mb-1">
                    Shipping Address
                  </p>
                  <p className="text-(--color-text)">
                    {viewOrder.shippingAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
