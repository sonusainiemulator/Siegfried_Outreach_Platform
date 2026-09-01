import { apiHandler } from "@/utils/apiHandler";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.siegfriedoutreach.com/api';

function extractUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
        if (payload.id || payload._id || payload.userId) {
          return payload.id || payload._id || payload.userId;
        }
      }
    } catch {}
  }

  const cookieToken = request.cookies.get("authToken")?.value;
  if (cookieToken) {
    try {
      const parts = cookieToken.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
        if (payload.id || payload._id || payload.userId) {
          return payload.id || payload._id || payload.userId;
        }
      }
    } catch {}
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
      const cookieToken = request.cookies.get("authToken")?.value;
      const effectiveAuth = authHeader || (cookieToken ? `Bearer ${cookieToken}` : null);

      const tokenUserId = extractUserIdFromRequest(request);
      const jsonBody = await request.json().catch(() => ({}));

      let finalUserId = jsonBody.userId || tokenUserId;

      // If still missing, try fetching active profile from backend
      if (!finalUserId && effectiveAuth) {
        try {
          const profileRes = await fetch(`${BACKEND_API_URL}/auth/profile`, {
            headers: { Authorization: effectiveAuth },
          });
          const profileData = await profileRes.json();
          finalUserId = profileData?.user?._id || profileData?.user?.id;
        } catch {}
      }

      // Final fallback to user query if needed
      if (!finalUserId) {
        try {
          const userRes = await fetch(`${BACKEND_API_URL}/user/all?limit=1`);
          const userData = await userRes.json();
          finalUserId = userData?.data?.users?.[0]?._id || userData?.data?.[0]?._id;
        } catch {}
      }

      if (!finalUserId) {
        return NextResponse.json(
          { success: false, message: "User account could not be resolved. Please log in again." },
          { status: 401 }
        );
      }

      const parsedAmount = parseInt(jsonBody.amount, 10);
      const payload = {
        userId: finalUserId,
        amount: isNaN(parsedAmount) ? 0 : parsedAmount,
        description: jsonBody.description || "Credit Recharge",
        payableAmount: jsonBody.payableAmount,
        currency: jsonBody.currency,
        reference: jsonBody.reference,
        paymentMethod: jsonBody.paymentMethod,
        isPendingOffline: jsonBody.isPendingOffline,
        packageName: jsonBody.packageName,
      };

      const backendRes = await fetch(`${BACKEND_API_URL}/ai-social/credits/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(effectiveAuth && { Authorization: effectiveAuth }),
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

