import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const BaseUrl = process.env.CAR_BASE_URL;
    if (!BaseUrl) {
      console.error("CAR_BASE_URL is not defined");
      return NextResponse.json(
        { message: "Server configuration error: CAR_BASE_URL is not defined" },
        { status: 500 }
      );
    }
    const body = await req.json();
    const {
      make,
      model,
      year,
      price,
      mileage,
      description,
      color,
      fuel_type,
      transmission,
      image,
    } = body;
    console.log("Signup request body:", body);

    const response = await fetch(`${BaseUrl}/cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        make,
        model,
        year,
        price,
        mileage,
        description,
        color,
        fuel_type,
        transmission,
        image,
      }),
    });

    const data = await response.json();
    console.log("External API signup response:", {
      status: response.status,
      data,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Signup failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in signup API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
