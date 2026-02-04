import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Product from "@/models/Product";

// GET - Fetch product counts for all categories
export async function GET() {
  try {
    await dbConnect();

    // Aggregate product counts by category
    const categoryCounts = await Product.aggregate([
      {
        $group: {
          _id: "$categorySlug",
          name: { $first: "$category" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          slug: "$_id",
          name: 1,
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get total product count
    const totalCount = await Product.countDocuments();

    return NextResponse.json(
      {
        success: true,
        total: totalCount,
        categories: categoryCounts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category counts" },
      { status: 500 },
    );
  }
}
