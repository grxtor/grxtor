import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkAuth, unauthorized } from "@/lib/admin-auth";

const DATA_FILE = path.join(process.cwd(), "data", "work.json");

async function readWork() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWork(work: unknown[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(work, null, 2));
}

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readWork());
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const item = await request.json();
  const work = await readWork();
  work.unshift(item);
  await writeWork(work);
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const work = await request.json();
  await writeWork(work);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const { company } = await request.json();
  const work = await readWork();
  const filtered = work.filter((w: { company: string }) => w.company !== company);
  await writeWork(filtered);
  return NextResponse.json({ success: true });
}
