"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Trash2, Calendar, Info, Plus, Pencil, X, Loader2 } from "lucide-react";

interface BlogPost {
  slug: string;
  filename: string;
  title: string;
  description: string;
  date: string;
}

interface BlogPostDetail {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
}

const emptyForm = { slug: "", title: "", description: "", date: "", content: "" };

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingState, setLoadingState] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ filename }),
    });
    load();
  };

  const startCreate = () => {
    setEditingSlug(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const startEdit = async (slug: string) => {
    setError("");
    const res = await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) {
      setError("Yazi yuklenemedi.");
      return;
    }
    const data: BlogPostDetail = await res.json();
    setEditingSlug(slug);
    setForm({
      slug: data.slug,
      title: data.title,
      description: data.description,
      date: data.date,
      content: data.content,
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingSlug(null);
    setForm(emptyForm);
    setError("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/admin/blog", {
      method: editingSlug ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess(editingSlug ? "Yazi guncellendi!" : "Yazi olusturuldu!");
      cancelForm();
      load();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ? "Gecersiz veri, alanlari kontrol edin." : "Bir hata olustu.");
    }
    setSaving(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loadingState) return (
    <div className="flex items-center justify-center py-20">
      <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">Blog yazilarini yonet</p>
        </div>
        {!showForm && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition cursor-pointer"
          >
            <Plus className="size-4" /> Yeni Yazi
          </button>
        )}
      </div>

      <div className="border border-border rounded-2xl p-5 bg-card flex items-start gap-3">
        <Info className="size-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          Yazilar MDX formatinda <code className="px-1.5 py-0.5 rounded-lg bg-muted text-foreground text-xs font-mono">content/</code> klasorune yazilir.
          Yeni veya duzenlenen yazilar sitede gorunmeden once projenin yeniden derlenmesi (rebuild) gerekir.
        </div>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">{success}</div>
      )}

      {showForm && (
        <div className="border border-border rounded-2xl p-6 bg-card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              {editingSlug ? <Pencil className="size-5" /> : <Plus className="size-5" />}
              {editingSlug ? "Yaziyi Duzenle" : "Yeni Yazi Ekle"}
            </h2>
            <button onClick={cancelForm} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center cursor-pointer">
              <X className="size-4" />
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Baslik *" value={form.title} onChange={v => setForm({ ...form, title: v })} required />
              <Field
                label="Slug *"
                value={form.slug}
                onChange={v => setForm({ ...form, slug: v })}
                required
                disabled={!!editingSlug}
                placeholder="ornegin-boyle-bir-slug"
              />
              <Field label="Tarih *" value={form.date} onChange={v => setForm({ ...form, date: v })} required placeholder="2026-07-06" />
              <Field label="Aciklama" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Icerik (MDX) *</label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                rows={14}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono resize-y cursor-text"
              />
            </div>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? "Kaydediliyor..." : editingSlug ? "Guncelle" : "Olustur"}
            </button>
          </form>
        </div>
      )}

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
                <div className="shrink-0 flex items-center gap-2">
                  <button onClick={() => startEdit(post.slug)}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 rounded-xl px-3 py-1.5 transition cursor-pointer flex items-center gap-1">
                    <Pencil className="size-3" /> Duzenle
                  </button>
                  <button onClick={() => remove(post.filename)}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/50 rounded-xl px-3 py-1.5 transition cursor-pointer flex items-center gap-1">
                    <Trash2 className="size-3" /> Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm cursor-text disabled:opacity-50 disabled:cursor-not-allowed" />
    </div>
  );
}
