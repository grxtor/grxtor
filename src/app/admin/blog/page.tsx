"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../layout";
import { FileText, Trash2, Calendar, Info } from "lucide-react";

interface BlogPost {
  slug: string;
  filename: string;
  title: string;
  description: string;
  date: string;
}

export default function BlogPage() {
  const { password } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingState, setLoadingState] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/blog");
    if (res.ok) setPosts(await res.json());
    setLoadingState(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (filename: string) => {
    if (!confirm("Bu blog yazisini silmek istediginize emin misiniz?")) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ filename }),
    });
    load();
  };

  if (loadingState) return (
    <div className="flex items-center justify-center py-20">
      <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground text-sm mt-1">Blog yazilarini yonet</p>
      </div>

      <div className="border border-border rounded-2xl p-5 bg-card flex items-start gap-3">
        <Info className="size-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          Blog yazilari MDX formatinda <code className="px-1.5 py-0.5 rounded-lg bg-muted text-foreground text-xs font-mono">content/</code> klasorune eklenir.
          Yeni yazi eklemek icin projedeki content klasorune bir <code className="px-1.5 py-0.5 rounded-lg bg-muted text-foreground text-xs font-mono">.mdx</code> dosyasi olusturun.
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Mevcut Yazilar <span className="text-muted-foreground font-normal text-base">({posts.length})</span></h2>
        {posts.length === 0 ? (
          <div className="border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm bg-card">
            Henuz blog yazisi eklenmemis.
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.slug} className="flex items-start justify-between gap-4 border border-border rounded-2xl p-5 bg-card">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="font-semibold">{post.title}</span>
                  </div>
                  {post.date && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      {post.date}
                    </div>
                  )}
                  {post.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
                  )}
                  <div className="text-xs text-muted-foreground font-mono">{post.filename}</div>
                </div>
                <button onClick={() => remove(post.filename)}
                  className="shrink-0 text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/50 rounded-xl px-3 py-1.5 transition cursor-pointer flex items-center gap-1">
                  <Trash2 className="size-3" /> Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
