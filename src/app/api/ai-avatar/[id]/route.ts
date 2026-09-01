import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return apiHandler(request, `/ai-avatar/${id}`);
}
