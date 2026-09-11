import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join("/") : "";
  return apiHandler(request, `/passkey/${subpath}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join("/") : "";
  return apiHandler(request, `/passkey/${subpath}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path ? path.join("/") : "";
  return apiHandler(request, `/passkey/${subpath}`);
}
