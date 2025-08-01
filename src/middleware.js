import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;
  console.log("Middleware running for:", pathname);

  if (!token) return NextResponse.next(); // user not logged in, let them visit anything

  try {
    await jwtVerify(token, JWT_SECRET);

    // If logged in, block access to login/register
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.warn("⛔ Invalid token:", err.message);
    return NextResponse.next(); // token exists but invalid → let them through anyway
  }
}

export const config = {
  matcher: ["/login", "/register"], // Only run this for these pages
};
