import { apiHandler } from "@/utils/apiHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const res = await apiHandler(request, "/setting");
  try {
    const data = await res.json();
    if (data && data.settings) {
      if (!data.settings.app_name || typeof data.settings.app_name !== 'string' || data.settings.app_name.includes('TTOS')) {
        data.settings.app_name = 'Siegfried Outreach - Social Media Marketing Agency';
      }
      if (!data.settings.app_description || typeof data.settings.app_description !== 'string' || data.settings.app_description.includes('TTOS')) {
        data.settings.app_description = 'Social Media Marketing Agency & AI-Powered Outreach Platform';
      }
      data.settings.logo_light_url = '/images/ttos-logo-light.png';
      data.settings.logo_dark_url = '/images/ttos-logo-dark.png';
      data.settings.landing_logo_url = '/images/ttos-logo-dark.png';
      data.settings.sidebar_logo_url = '/images/ttos-logo-square.png';
      data.settings.mobile_logo_url = '/images/ttos-logo-square.png';
      data.settings.favicon_url = '/images/ttos-logo-square.png';
      data.settings.favicon_notification_logo_url = '/images/ttos-logo-square.png';
      data.settings.onboarding_logo_url = '/images/ttos-logo-dark.png';
    }
    return NextResponse.json(data, { status: res.status });
  } catch {
    return res;
  }
}
