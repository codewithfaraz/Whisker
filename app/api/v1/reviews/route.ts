import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import mongoose from "mongoose";

// GET - Fetch reviews for a product
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 },
      );
    }

    // Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID format" },
        { status: 400 },
      );
    }

    // Build sort
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const reviews = await Review.find({ productId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({ productId });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const avgRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;

    // Transform reviews
    const transformedReviews = reviews.map((review) => ({
      ...review,
      id: review._id.toString(),
      productId: review.productId.toString(),
      _id: undefined,
      date: review.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        reviews: transformedReviews,
        stats: {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: total,
        },
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
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// POST - Create a new review
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { productId, author, email, rating, title, content } = body;

    // Validation
    if (!productId || !author || !email || !rating || !title || !content) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID format" },
        { status: 400 },
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Create review
    const review = await Review.create({
      productId,
      author: author.trim(),
      email: email.trim().toLowerCase(),
      rating: parseInt(rating),
      title: title.trim(),
      content: content.trim(),
      verified: false,
      helpful: 0,
    });

    // Update product's review count and average rating
    const ratingStats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (ratingStats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(ratingStats[0].avgRating * 10) / 10,
        reviewCount: ratingStats[0].count,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review: {
          ...review.toObject(),
          id: review._id.toString(),
          productId: review.productId.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 },
    );
  }
}
