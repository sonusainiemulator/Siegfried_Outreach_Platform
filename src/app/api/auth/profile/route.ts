import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return apiHandler(request, "/auth/profile");
}

export async function PUT(request: NextRequest) {
  return apiHandler(request, "/auth/profile");
}

export async function POST(request: NextRequest) {
  return apiHandler(request, "/auth/profile");
}
