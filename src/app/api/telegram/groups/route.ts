import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return apiHandler(request, `/telegram/groups`);
}

export async function DELETE(request: NextRequest) {
  return apiHandler(request, `/telegram/groups/bulk-delete`);
}