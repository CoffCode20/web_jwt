import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema to validate the incoming request body
const carSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number().int(),
  price: z.number().positive(),
  mileage: z.number().nonnegative(),
  description: z.string().optional(),
  color: z.string(),
  fuel_type: z.string(),
  transmission: z.string(),
  image: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const BaseUrl = process.env.CAR_BASE_URL;

    if (!BaseUrl) {
      console.error("CAR_BASE_URL is not defined in environment variables.");
      return NextResponse.json(
        { message: "Server configuration error: CAR_BASE_URL is not defined" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const result = carSchema.safeParse(body);

    if (!result.success) {
      console.error("Invalid car input:", result.error.flatten());
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const carData = result.data;
    console.log("Creating car with data:", carData);

    const response = await fetch(`${BaseUrl}/cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carData),
    });

    const data = await response.json();
    console.log("External API response:", {
      status: response.status,
      data,
    });

    if (!response.ok) {
      console.error("External API error:", data);
      return NextResponse.json(
        {
          message: data.message || "Failed to create car in external API",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "Car created successfully",
      data,
    });
  } catch (error) {
    console.error("Unexpected error in /api/crud/create:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
