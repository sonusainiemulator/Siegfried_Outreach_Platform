import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Common handler to proxy requests from Next.js API routes to the backend API.
 * 
 * @param request - Original NextRequest
 * @param endpoint - Backend endpoint (e.g., '/auth/login', '/faq/all')
 * @param overridenMethod - Optional method override (e.g., if you want to use POST to a PUT endpoint)
 * @returns NextResponse
 */
export async function apiHandler(
  request: NextRequest,
  endpoint: string,
  overridenMethod?: string
) {
  try {
    const method = overridenMethod || request.method;
    const token = request.headers.get("authorization");
    const contentType = request.headers.get("content-type");
    
    let url = `${BACKEND_API_URL}${endpoint}`;
    
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }

    const headers: Record<string, string> = {
      ...(token && { "Authorization": token }),
    };

    let body: any = undefined;

    if (!["GET", "HEAD"].includes(method)) {
      if (contentType?.includes("application/json")) {
        headers["Content-Type"] = "application/json";
        try {
          const jsonBody = await request.json();
          body = JSON.stringify(jsonBody);
        } catch (e) {
          // Body might be empty
        }
      } else if (contentType?.includes("multipart/form-data")) {
        // For multipart/form-data, we let fetch set the boundary
        body = await request.formData();
      } else {
        body = await request.blob();
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body as any, // Cast to any to handle multipart/form-data with browser's fetch
    });

    const responseContentType = response.headers.get("content-type");

    if (responseContentType && responseContentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // For binary responses (CSV, XLSX, etc.), return the raw response
      return new NextResponse(response.body, {
        status: response.status,
        headers: response.headers,
      });
    }
  } catch (error: unknown) {
    console.error(`API Error for ${endpoint}:`, error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
