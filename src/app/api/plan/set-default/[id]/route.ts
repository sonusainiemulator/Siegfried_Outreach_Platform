import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return apiHandler(request, `/plan/set-default/${id}`);
}