import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Product from "@/models/Product";
import { deleteImage } from "@/app/lib/cloudinary";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single product by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        product: {
          ...product,
          id: product._id.toString(),
          _id: undefined,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PUT - Update a product
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      price,
      originalPrice,
      description,
      shortDescription,
      images,
      imagePublicIds,
      category,
      tags,
      stockCount,
      variants,
      features,
      inStock,
      isFeatured,
      isNew,
      isBestseller,
    } = body;

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
      // Update slug if name changes
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined)
      updateData.originalPrice = originalPrice
        ? parseFloat(originalPrice)
        : null;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined)
      updateData.shortDescription = shortDescription;
    if (images !== undefined) updateData.images = images;
    if (imagePublicIds !== undefined)
      updateData.imagePublicIds = imagePublicIds;
    if (category !== undefined) {
      updateData.category = category;
      updateData.categorySlug = category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    if (tags !== undefined) updateData.tags = tags;
    if (stockCount !== undefined) {
      const parsedStockCount = parseInt(stockCount) || 0;
      updateData.stockCount = parsedStockCount;
      updateData.inStock = parsedStockCount > 0;
    }
    if (variants !== undefined) updateData.variants = variants;
    if (features !== undefined) updateData.features = features;
    // inStock is now auto-calculated from stockCount, ignore explicit value
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isNew !== undefined) updateData.isNewArrival = isNew;
    if (isBestseller !== undefined) updateData.isBestseller = isBestseller;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).lean();

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: {
          ...updatedProduct,
          id: updatedProduct?._id.toString(),
          _id: undefined,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a product
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    // Delete images from Cloudinary
    if (product.imagePublicIds && product.imagePublicIds.length > 0) {
      await Promise.all(
        product.imagePublicIds.map((publicId: string) => deleteImage(publicId)),
      );
    }

    // Delete product from database
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 },
    );
  }
}
