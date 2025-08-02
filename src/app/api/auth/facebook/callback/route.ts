import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/dashboard/login?error=oauth_error", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard/login?error=no_code", request.url)
    );
  }

  try {
    const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
    const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const redirectUri =
      process.env.FACEBOOK_REDIRECT_URI ||
      "http://localhost:3000/api/auth/facebook/callback";

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://graph.facebook.com/v18.0/oauth/access_token",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const tokenUrl = new URL(
      "https://graph.facebook.com/v18.0/oauth/access_token"
    );
    tokenUrl.searchParams.set("client_id", facebookClientId!);
    tokenUrl.searchParams.set("client_secret", facebookClientSecret!);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);

    const tokenRes = await fetch(tokenUrl.toString());

    if (!tokenRes.ok) {
      throw new Error("Failed to exchange code for access token");
    }

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      throw new Error(tokenData.error.message || "OAuth error");
    }

    // Get user info
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
    );

    if (!userResponse.ok) {
      throw new Error("Failed to get user info");
    }

    const userData = await userResponse.json();

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Generate a session token
    // 4. Set cookies or redirect with tokens

    // For now, we'll redirect to dashboard with user info
    const redirectUrl = new URL("/dashboard", request.url);
    redirectUrl.searchParams.set("oauth_success", "true");
    redirectUrl.searchParams.set("provider", "facebook");
    redirectUrl.searchParams.set("email", userData.email || "");

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/login?error=oauth_failed", request.url)
    );
  }
}
