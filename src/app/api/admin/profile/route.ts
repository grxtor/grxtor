import { NextRequest, NextResponse } from "next/server";
import { checkAuth, unauthorized } from "@/lib/admin-auth";
import { ProfileData, readJsonFile, writeJsonFile } from "@/lib/data";
import { profileSchema } from "@/lib/schemas";

const FILE = "profile.json";

export async function GET() {
  return NextResponse.json(await readJsonFile<Partial<ProfileData>>(FILE, {}));
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await writeJsonFile(FILE, parsed.data);
  return NextResponse.json({ success: true });
}
