import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return apiHandler(request, `/subscription/cancel`);
}
