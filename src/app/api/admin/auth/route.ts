import { NextRequest, NextResponse } from "next/server";
import { checkAuth, unauthorized } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  return NextResponse.json({ success: true });
}
