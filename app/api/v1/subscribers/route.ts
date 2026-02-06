import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Subscriber from "@/models/Subscriber";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed!" },
        { status: 400 },
      );
    }

    await Subscriber.create({ email });

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Subscription error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      return NextResponse.json(
        { success: false, message: messages[0] },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
}
