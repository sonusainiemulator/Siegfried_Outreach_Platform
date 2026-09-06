import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return apiHandler(request, "/social-analytics");
}

export async function POST(request: NextRequest) {
  return apiHandler(request, "/social-analytics");
}

export async function PUT(request: NextRequest) {
  return apiHandler(request, "/social-analytics");
}

export async function DELETE(request: NextRequest) {
  return apiHandler(request, "/social-analytics");
}
