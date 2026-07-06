import { NextRequest, NextResponse } from "next/server";
import { checkAuth, unauthorized } from "@/lib/admin-auth";
import { ProjectData, readJsonFile, writeJsonFile } from "@/lib/data";
import { projectArraySchema, projectItemSchema } from "@/lib/schemas";

const FILE = "projects.json";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readJsonFile<ProjectData[]>(FILE, []));
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = projectItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const projects = await readJsonFile<ProjectData[]>(FILE, []);
  projects.unshift(parsed.data);
  await writeJsonFile(FILE, projects);
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = projectArraySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await writeJsonFile(FILE, parsed.data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const { id } = await request.json().catch(() => ({ id: undefined }));
  const projects = await readJsonFile<ProjectData[]>(FILE, []);
  const filtered = projects.filter((p) => p.id !== id);
  await writeJsonFile(FILE, filtered);
  return NextResponse.json({ success: true });
}
