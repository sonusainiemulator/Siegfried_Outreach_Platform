import { NextRequest, NextResponse } from "next/server";

const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, '') ||
  'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const path = (await params).path.join('/');
  const url = `${STORAGE_BASE_URL}/uploads/${path}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new NextResponse("File not found", { status: 404 });
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Proxy error for uploads:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
