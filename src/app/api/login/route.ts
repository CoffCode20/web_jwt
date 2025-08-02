import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  try {
    // fetch with api
    const fetchData = await fetch(
      "https://car-nextjs-api.cheatdev.online/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!fetchData.ok) {
      return NextResponse.json(
        {
          message: "Failed to register",
        },
        {
          status: fetchData.status,
        }
      );
    }
    const data = await fetchData.json();
    console.log("the data after login: ", data);

    // set cookies
    const cookieStore = cookies();
    const cookieName = process.env.CAR_TOKEN_NAME || "refreshToken";
    const refreshToken = data.refresh_token;
    const accessToken = data.access_token;

    const response = NextResponse.json(data);

    if (refreshToken) {
      // set refreshToken cookie
      response.cookies.set(cookieName, refreshToken, {
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    if (accessToken) {
      // set accessToken cookie
      response.cookies.set("accessToken", accessToken, {
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
