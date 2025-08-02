import { authOptions } from "@/lib/auth/next-auth-options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function proxyRequest(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
  method: string
): Promise<NextResponse> {
  const paramsResolved = await ctx.params;

  // Auth check
  const session = await getServerSession(authOptions);
  if (!session?.access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const BASE_URL =
    process.env.BASE_URL_MBBANKING_API || "http://localhost:8080/api/v1";

  const url = `${BASE_URL}/${paramsResolved.path.join("/")}${
    req.nextUrl.search
  }`;

  const hasBody = ["POST", "PUT", "PATCH"].includes(method);
  const body = hasBody ? await req.text() : undefined;

  try {
    const apiRes = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body,
    });

    const contentType = apiRes.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await apiRes.json()
      : await apiRes.text();

    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export const GET = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, ctx, "GET");

export const POST = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, ctx, "POST");

export const PUT = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, ctx, "PUT");

export const PATCH = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, ctx, "PATCH");

export const DELETE = (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, ctx, "DELETE");
