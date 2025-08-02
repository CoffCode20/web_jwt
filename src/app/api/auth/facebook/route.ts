import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri =
    process.env.FACEBOOK_REDIRECT_URI ||
    "http://localhost:3000/api/auth/facebook/callback";

  if (!facebookClientId) {
    return NextResponse.json(
      { error: "Facebook OAuth not configured" },
      { status: 500 }
    );
  }

  const authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
  authUrl.searchParams.set("client_id", facebookClientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "email public_profile");

  return NextResponse.redirect(authUrl.toString());
}
