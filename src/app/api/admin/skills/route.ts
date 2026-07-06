import { NextRequest, NextResponse } from "next/server";
import { checkAuth, unauthorized } from "@/lib/admin-auth";
import { readJsonFile, writeJsonFile } from "@/lib/data";
import { skillsSchema } from "@/lib/schemas";

const FILE = "skills.json";

export async function GET() {
  return NextResponse.json(await readJsonFile<string[]>(FILE, []));
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = skillsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await writeJsonFile(FILE, parsed.data);
  return NextResponse.json({ success: true });
}
