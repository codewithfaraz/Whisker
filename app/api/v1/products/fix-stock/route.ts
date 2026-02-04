import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Product from "@/models/Product";

// POST - Fix inStock status for all products based on stockCount
export async function POST() {
  try {
    await dbConnect();

    // Update all products where stockCount > 0 but inStock is false
    const result = await Product.updateMany(
      { stockCount: { $gt: 0 }, inStock: false },
      { $set: { inStock: true } },
    );

    // Also update products where stockCount is 0 or less but inStock is true
    const result2 = await Product.updateMany(
      { stockCount: { $lte: 0 }, inStock: true },
      { $set: { inStock: false } },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Stock status fixed for all products",
        fixed: {
          setToInStock: result.modifiedCount,
          setToOutOfStock: result2.modifiedCount,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fixing stock status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fix stock status" },
      { status: 500 },
    );
  }
}
