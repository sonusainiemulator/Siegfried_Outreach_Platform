import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return apiHandler(request, `/social-accounts`);
}

export async function POST(request: NextRequest) {
  return apiHandler(request, "/social-accounts");
}