import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  return apiHandler(request, "/user/update");
}
