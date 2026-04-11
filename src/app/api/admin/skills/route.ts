import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkAuth, unauthorized } from "@/lib/admin-auth";

const DATA_FILE = path.join(process.cwd(), "data", "skills.json");

async function readSkills() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json(await readSkills());
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const skills = await request.json();
  await fs.writeFile(DATA_FILE, JSON.stringify(skills, null, 2));
  return NextResponse.json({ success: true });
}
