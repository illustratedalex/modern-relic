import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Reject malformed shop URLs before the deployment's page loader sees them.
  if (/^\/shop(?:%5c|\\)\/?$/i.test(request.nextUrl.pathname)) {
    return new Response("Bad Request", { status: 400 });
  }
}
