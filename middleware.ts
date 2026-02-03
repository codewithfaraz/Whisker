import { NextRequest, NextResponse } from "next/server";
export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/", request.url));
  const { nextUrl } = request;
}
export const config = {
  matcher: ["/profile/:path*", "/login", "/signup"],
};
