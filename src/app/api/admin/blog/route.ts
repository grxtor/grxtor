import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkAuth, unauthorized } from "@/lib/admin-auth";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function listPosts() {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const posts = await Promise.all(
      files.filter(f => f.endsWith(".mdx")).map(async (file) => {
        const content = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
        const slug = file.replace(".mdx", "");
        const titleMatch = content.match(/title:\s*["']?(.+?)["']?\s*$/m);
        const descMatch = content.match(/description:\s*["']?(.+?)["']?\s*$/m);
        const dateMatch = content.match(/date:\s*["']?(.+?)["']?\s*$/m);
        return {
          slug,
          filename: file,
          title: titleMatch?.[1] || slug,
          description: descMatch?.[1] || "",
          date: dateMatch?.[1] || "",
        };
      })
    );
    return posts;
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json(await listPosts());
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const { filename } = await request.json();
  const filePath = path.join(CONTENT_DIR, filename);
  if (!filename.endsWith(".mdx") || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }
  await fs.unlink(filePath);
  return NextResponse.json({ success: true });
}
