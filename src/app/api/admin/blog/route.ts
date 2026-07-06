import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkAuth, unauthorized } from "@/lib/admin-auth";
import { blogPostSchema } from "@/lib/schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");
const SLUG_REGEX = /^[a-z0-9-]+$/;

async function listPosts() {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const posts = await Promise.all(
      files.filter(f => f.endsWith(".mdx")).map(async (file) => {
        const content = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
        const slug = file.replace(".mdx", "");
        const titleMatch = content.match(/title:\s*["']?(.+?)["']?\s*$/m);
        const descMatch = content.match(/summary:\s*["']?(.+?)["']?\s*$/m);
        const dateMatch = content.match(/publishedAt:\s*["']?(.+?)["']?\s*$/m);
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

// content-collections requires title/publishedAt/summary; map our title/date/description fields onto that schema so the post is valid at build time.
function buildMdx({ title, description, date, content }: { title: string; description: string; date: string; content: string }) {
  const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `---
title: "${escape(title)}"
publishedAt: "${escape(date)}"
updatedAt: "${escape(date)}"
author: "GRXTOR"
summary: "${escape(description)}"
image: ""
---

${content.trimStart()}
`;
}

export async function GET(request: NextRequest) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (slug === null) {
    return NextResponse.json(await listPosts());
  }

  if (!checkAuth(request)) return unauthorized();
  if (!SLUG_REGEX.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf-8");
    const titleMatch = raw.match(/title:\s*["']?(.+?)["']?\s*$/m);
    const descMatch = raw.match(/summary:\s*["']?(.+?)["']?\s*$/m);
    const dateMatch = raw.match(/publishedAt:\s*["']?(.+?)["']?\s*$/m);
    const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, "").trimStart();
    return NextResponse.json({
      slug,
      title: titleMatch?.[1] || "",
      description: descMatch?.[1] || "",
      date: dateMatch?.[1] || "",
      content: body,
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// New/edited posts only appear on the public blog after a rebuild — content-collections compiles content/*.mdx at build time, not on request.
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { slug, title, description, date, content } = parsed.data;
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.writeFile(path.join(CONTENT_DIR, `${slug}.mdx`), buildMdx({ title, description, date, content }));
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { slug, title, description, date, content } = parsed.data;
  await fs.writeFile(path.join(CONTENT_DIR, `${slug}.mdx`), buildMdx({ title, description, date, content }));
  return NextResponse.json({ success: true });
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
