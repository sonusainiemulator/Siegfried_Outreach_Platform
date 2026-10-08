import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return apiHandler(request, "/contact");
}

export async function POST(request: NextRequest) {
  return apiHandler(request, "/contact/create");
}

export async function DELETE(request: NextRequest) {
  return apiHandler(request, "/contact/delete");
}
