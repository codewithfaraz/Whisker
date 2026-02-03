import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const response = NextResponse.json({
      message: "You Logged out Successfully",
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
