import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ chatbotId: string; dataType: string; dataId: string }> }
) {
  const { chatbotId, dataType, dataId } = await params;
  return apiHandler(request, `/training/${chatbotId}/${dataType}/${dataId}`);
}
