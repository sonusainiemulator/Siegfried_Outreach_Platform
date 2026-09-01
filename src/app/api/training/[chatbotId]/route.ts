import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ chatbotId: string }> }) {
  const { chatbotId } = await params;
  return apiHandler(request, `/training/${chatbotId}`);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ chatbotId: string }> }) {
  const { chatbotId } = await params;
  return apiHandler(request, `/training/${chatbotId}`);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ chatbotId: string }> }) {
  const { chatbotId } = await params;
  return apiHandler(request, `/training/${chatbotId}`);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ chatbotId: string }> }) {
  const { chatbotId } = await params;
  return apiHandler(request, `/training/${chatbotId}`);
}
