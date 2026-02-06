import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import Message from "@/models/Message";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { firstName, lastName, email, subject, message } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    const newMessage = await Message.create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        data: newMessage,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Contact form error:", error);

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
