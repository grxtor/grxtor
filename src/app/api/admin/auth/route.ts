import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  checkAuth,
  clearFailedAttempts,
  createSessionToken,
  getClientIp,
  isRateLimited,
  recordFailedAttempt,
  unauthorized,
  verifyPassword,
} from "@/lib/admin-auth";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!verifyPassword(password)) {
    recordFailedAttempt(ip);
    return unauthorized();
  }

  clearFailedAttempts(ip);
  const token = createSessionToken();
  if (!token) return unauthorized();

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, cookieOptions(ADMIN_SESSION_MAX_AGE_SECONDS));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", cookieOptions(0));
  return response;
}
