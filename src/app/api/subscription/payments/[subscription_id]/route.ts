import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subscription_id: string }> }
) {
  const { subscription_id } = await params;
  return apiHandler(request, `/subscription/payments/${subscription_id}`);
}
