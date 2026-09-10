import { apiHandler } from "@/utils/apiHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const res = await apiHandler(request, "/setting/public");
  try {
    const data = await res.json();
    if (data && data.settings) {
      if (data.settings.app_name && typeof data.settings.app_name === 'string') {
        data.settings.app_name = data.settings.app_name
          .replace(/siegfried\s*outreach/gi, 'TTOS')
          .replace(/siegfried/gi, 'TTOS');
      }
      if (data.settings.app_description && typeof data.settings.app_description === 'string') {
        data.settings.app_description = data.settings.app_description
          .replace(/siegfried\s*outreach/gi, 'TTOS')
          .replace(/siegfried/gi, 'TTOS');
      }
    }
    return NextResponse.json(data, { status: res.status });
  } catch {
    return res;
  }
}
