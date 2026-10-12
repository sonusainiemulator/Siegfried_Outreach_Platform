import { apiHandler } from "@/utils/apiHandler";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const res = await apiHandler(request, "/setting/public");
  try {
    const data = await res.json();
    if (data && data.settings) {
      if (!data.settings.app_name || typeof data.settings.app_name !== 'string' || !data.settings.app_name.trim()) {
        data.settings.app_name = 'Siegfried Outreach - Social Media Marketing Agency';
      }
      if (!data.settings.app_description || typeof data.settings.app_description !== 'string' || !data.settings.app_description.trim()) {
        data.settings.app_description = 'Social Media Marketing Agency & AI-Powered Outreach Platform';
      }
      // Use dynamic logos and icons from backend, fallback to defaults only if unconfigured
      data.settings.logo_light_url = data.settings.logo_light_url || '/images/siegfried-outreach-og.png';
      data.settings.logo_dark_url = data.settings.logo_dark_url || '/images/siegfried-outreach-og.png';
      data.settings.landing_logo_url = data.settings.landing_logo_url || '/images/siegfried-outreach-og.png';
      data.settings.sidebar_logo_url = data.settings.sidebar_logo_url || '/images/siegfried-outreach-square.png';
      data.settings.mobile_logo_url = data.settings.mobile_logo_url || '/images/siegfried-outreach-square.png';
      data.settings.favicon_url = data.settings.favicon_url || '/images/siegfried-outreach-square.png';
      data.settings.favicon_notification_logo_url = data.settings.favicon_notification_logo_url || '/images/siegfried-outreach-square.png';
      data.settings.onboarding_logo_url = data.settings.onboarding_logo_url || '/images/siegfried-outreach-og.png';
    }
    return NextResponse.json(data, { status: res.status });
  } catch {
    return res;
  }
}
