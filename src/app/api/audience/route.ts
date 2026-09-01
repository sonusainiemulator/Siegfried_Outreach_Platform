import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return apiHandler(request, "/audience");
}

export async function DELETE(request: NextRequest) {
  return apiHandler(request, "/audience/delete");
}

export async function POST(request: NextRequest) {
  return apiHandler(request, "/audience/create");
}