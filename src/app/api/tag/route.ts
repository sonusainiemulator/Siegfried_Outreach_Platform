import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    return apiHandler(request, "/tag/all")
}

export async function POST(request: NextRequest) {
    return apiHandler(request, "/tag/create")
}

export async function DELETE(request: NextRequest) {
    return apiHandler(request, "/tag/delete")
}

