import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(
  request: NextRequest,
  context: { params: { carId: string } }
) {
  const { carId } = context.params;
  const body = await request.json();
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
    is_sold,
  } = body;

  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const fetchData = await fetch(
      "https://car-nextjs-api.cheatdev.online/cars/${carId}",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
          is_sold,
        }),
      }
    );
    if (!fetchData.ok) {
      return NextResponse.json(
        {
          message: "Failed to update",
        },
        {
          status: fetchData.status,
        }
      );
    }
    const result = fetchData.json();
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }
}
