import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF",
        },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 5MB limit" },
        { status: 400 },
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: `cat-shop/${folder}`,
      resource_type: "image",
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        image: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image" },
      { status: 500 },
    );
  }
}

// DELETE - Remove an image from Cloudinary
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "Public ID is required" },
        { status: 400 },
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json(
      {
        success: true,
        message: "Image deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete image" },
      { status: 500 },
    );
  }
}
