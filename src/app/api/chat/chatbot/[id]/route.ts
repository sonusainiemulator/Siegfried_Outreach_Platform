import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Parse the body to get sessionId
  const body = await request.json();
  const sessionId = body.sessionId;
  
  // Build URL with sessionId query parameter if provided
  let endpoint = `/chat/chatbot/${id}`;
  if (sessionId) {
    endpoint += `?sessionId=${sessionId}`;
  }
  
  // Create a new request with the modified body
  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(body),
  });
  
  return apiHandler(newRequest, endpoint);
}
