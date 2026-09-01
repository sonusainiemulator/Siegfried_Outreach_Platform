import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  return apiHandler(request, `/role/delete`);
}
