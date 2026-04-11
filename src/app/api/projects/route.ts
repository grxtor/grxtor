import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkAuth, unauthorized } from "@/lib/admin-auth";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

async function readProjects() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeProjects(projects: unknown[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
}

export async function GET() {
  const projects = await readProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const project = await request.json();
  const projects = await readProjects();
  projects.unshift(project);
  await writeProjects(projects);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const { title } = await request.json();
  const projects = await readProjects();
  const filtered = projects.filter((p: { title: string }) => p.title !== title);
  await writeProjects(filtered);
  return NextResponse.json({ success: true });
}
