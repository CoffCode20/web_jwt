import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  console.log("==========Middleware is Running========");
  console.log("==> URL:", req.url);
  console.log("==> Pathname:", req.nextUrl.pathname);

  // Get session token from cookie (works both dev and prod)
  const refreshToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!refreshToken;

  const authRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  const protectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

  console.log("==> Is Logged In:", isLoggedIn);
  console.log("==> Auth Route:", authRoute);
  console.log("==> Protected Route:", protectedRoute);

  if (authRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isLoggedIn && protectedRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/signup"],
};
