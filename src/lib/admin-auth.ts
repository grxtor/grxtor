import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "grxtor2025";

export function checkAuth(request: NextRequest): boolean {
  return request.headers.get("x-admin-password") === ADMIN_PASSWORD;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
