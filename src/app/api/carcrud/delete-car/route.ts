import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Delete car request body:", body);

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Car ID is required" },
        { status: 400 }
      );
    }

    // Try to get token from Authorization header first, then from cookies
    const authHeader = request.headers.get("authorization");
    let accessToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7); // Remove "Bearer " prefix
      console.log("Token found in Authorization header");
    } else {
      // Fallback to cookies
      accessToken = (await cookies()).get("accessToken")?.value;
      console.log("Token found in cookies:", accessToken ? "Yes" : "No");
    }

    if (!accessToken) {
      console.log("No access token found");
      return NextResponse.json(
        { message: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

    console.log("Making request to external API...");

    const carBaseUrl = process.env.CAR_BASE_URL;
    if (!carBaseUrl) {
      console.error("CAR_BASE_URL is not defined");
      return NextResponse.json(
        { message: "Server configuration error: CAR_BASE_URL is not defined" },
        { status: 500 }
      );
    }

    const fetchData = await fetch(`${carBaseUrl}/cars/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!fetchData.ok) {
      const errorData = await fetchData.text();
      console.error("External API Error:", errorData);
      console.error(
        "Status:",
        fetchData.status,
        "StatusText:",
        fetchData.statusText
      );

      let errorMessage = "Failed to delete car";
      if (fetchData.status === 403) {
        errorMessage =
          "Access denied. You may not have permission to delete this car.";
      } else if (fetchData.status === 404) {
        errorMessage = "Car not found. It may have already been deleted.";
      }

      return NextResponse.json(
        {
          message: errorMessage,
          error: errorData,
          status: fetchData.status,
        },
        {
          status: fetchData.status,
        }
      );
    }

    // For DELETE requests, the response might be empty or just a success message
    let result;
    const contentLength = fetchData.headers.get("content-length");
    const contentType = fetchData.headers.get("content-type");

    if (
      contentLength === "0" ||
      !contentType ||
      !contentType.includes("application/json")
    ) {
      result = { message: "Car deleted successfully", id: id };
    } else {
      try {
        result = await fetchData.json();
      } catch (jsonError) {
        console.log("No JSON response, assuming success");
        result = { message: "Car deleted successfully", id: id };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete car error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
