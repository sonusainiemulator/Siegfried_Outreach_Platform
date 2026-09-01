import { apiHandler } from "@/utils/apiHandler";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.siegfriedoutreach.com/api';

function extractUserIdFromBearer(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
      return payload.id || payload._id || payload.userId || null;
    }
  } catch {
    return null;
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join("/") : "";
  return apiHandler(request, `/ai-social/${subpath}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join("/") : "";

  // Special handler for credits/add to guarantee userId is resolved
  if (subpath === "credits/add") {
    try {
      const authHeader = request.headers.get("authorization");
      const tokenUserId = extractUserIdFromBearer(authHeader);
      const jsonBody = await request.json().catch(() => ({}));

      const finalUserId = jsonBody.userId || tokenUserId;
      if (!finalUserId) {
        return NextResponse.json(
          { success: false, message: "User authentication required to recharge credits." },
          { status: 401 }
        );
      }

      const payload = {
        userId: finalUserId,
        amount: parseInt(jsonBody.amount, 10) || 500,
        description: jsonBody.description || "Credit Recharge",
      };

      const backendRes = await fetch(`${BACKEND_API_URL}/ai-social/credits/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify(payload),
      });

      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    } catch (err: any) {
      console.error("Error handling credits/add:", err);
      return NextResponse.json(
        { success: false, message: err?.message || "Failed to process credit recharge" },
        { status: 500 }
      );
    }
  }

  return apiHandler(request, `/ai-social/${subpath}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join("/") : "";
  return apiHandler(request, `/ai-social/${subpath}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join("/") : "";
  return apiHandler(request, `/ai-social/${subpath}`);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join("/") : "";
  return apiHandler(request, `/ai-social/${subpath}`);
}

