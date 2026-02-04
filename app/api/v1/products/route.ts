import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Product from "@/models/Product";

// GET - Fetch all products with optional filters
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (slug) {
      query.slug = slug.toLowerCase();
    }

    if (category) {
      query.categorySlug = category.toLowerCase();
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    // Build sort
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    // Transform _id to id for frontend compatibility
    const transformedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(
      {
        success: true,
        products: transformedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST - Create a new product
export async function POST(request: Request) {
  try {
    await dbConnect();

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

    // Validation
    if (!name || !price || !description || !shortDescription || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 },
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: "A product with this name already exists" },
        { status: 400 },
      );
    }

    // Create category slug
    const categorySlug = category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Calculate stock count and inStock status
    const parsedStockCount = parseInt(stockCount) || 0;
    const calculatedInStock = parsedStockCount > 0;

    // Create product
    const product = await Product.create({
      name,
      slug,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      description,
      shortDescription,
      images,
      imagePublicIds: imagePublicIds || [],
      category,
      categorySlug,
      tags: tags || [],
      stockCount: parsedStockCount,
      variants: variants || [],
      features: features || [],
      inStock: calculatedInStock,
      isFeatured: isFeatured ?? false,
      isNewArrival: isNew ?? true,
      isBestseller: isBestseller ?? false,
      rating: 0,
      reviewCount: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: {
          ...product.toObject(),
          id: product._id.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 },
    );
  }
}
