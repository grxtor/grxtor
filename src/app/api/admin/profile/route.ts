import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkAuth, unauthorized } from "@/lib/admin-auth";

const DATA_FILE = path.join(process.cwd(), "data", "profile.json");

async function readProfile() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function GET() {
  return NextResponse.json(await readProfile());
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json();
  await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2));
  return NextResponse.json({ success: true });
}
