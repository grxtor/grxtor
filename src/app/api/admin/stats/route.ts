import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readJsonFile } from "@/lib/data";

const contentDir = path.join(process.cwd(), "content");

async function countJsonArray(file: string): Promise<number> {
  return (await readJsonFile<unknown[]>(file, [])).length;
}

async function countBlogPosts(): Promise<number> {
  try {
    const files = await fs.readdir(contentDir);
    return files.filter(f => f.endsWith(".mdx")).length;
  } catch {
    return 0;
  }
}

export async function GET() {
  const [projects, work, skills, blog] = await Promise.all([
    countJsonArray("projects.json"),
    countJsonArray("work.json"),
    countJsonArray("skills.json"),
    countBlogPosts(),
  ]);
  return NextResponse.json({ projects, work, skills, blog });
}
