import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  console.log("==========Middleware is Running========");
  console.log("==> Next Response URL", req.url);
  console.log("==> Next Response Pathname", req.nextUrl.pathname);

  // Get tokens from cookies
  const refreshToken = req.cookies.get("next-auth.session-token")?.value;

  // Check if user is logged in (has refresh token)
  const isLoggedIn = !!refreshToken;

  // Define route types
  const authRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");
  const protectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

  console.log("==> Is Logged In:", isLoggedIn);
  console.log("==> Auth Route:", authRoute);
  console.log("==> Protected Route:", protectedRoute);

  // If accessing auth routes while logged in, redirect to dashboard
  if (authRoute && isLoggedIn) {
    console.log("==> Redirecting to dashboard: Already logged in");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If accessing protected routes without login, redirect to login
  if (!isLoggedIn && protectedRoute) {
    console.log("==> Redirecting to login: Not logged in");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// config matcher
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
