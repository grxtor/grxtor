"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, FolderOpen, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  href: string;
  dates: string;
  description: string;
  technologies: string[];
  image: string;
  video: string;
  active: boolean;
}

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "", href: "", dates: "", description: "",
    technologies: "", image: "", video: "", active: true,
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/projects");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    const project: Project = {
      id: crypto.randomUUID(),
      title: form.title,
      href: form.href,
      dates: form.dates,
      description: form.description,
      technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean),
      image: form.image,
      video: form.video,
      active: form.active,
    };
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(project),
    });
    if (res.ok) {
      setForm({ title: "", href: "", dates: "", description: "", technologies: "", image: "", video: "", active: true });
      setSuccess("Proje eklendi!");
      load();
    }
    setLoading(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projeler</h1>
        <p className="text-muted-foreground text-sm mt-1">Portfolyo projelerini yonet</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">{success}</div>
      )}

      <div className="border border-border rounded-2xl p-6 bg-card space-y-5">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Plus className="size-5" /> Yeni Proje Ekle
        </h2>
        <form onSubmit={add} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Proje Adi *" value={form.title} onChange={v => setForm({...form, title: v})} required />
            <Field label="URL" value={form.href} onChange={v => setForm({...form, href: v})} placeholder="https://..." />
            <Field label="Tarih" value={form.dates} onChange={v => setForm({...form, dates: v})} placeholder="2024 - Present" />
            <Field label="Teknolojiler (virgul)" value={form.technologies} onChange={v => setForm({...form, technologies: v})} placeholder="React, Next.js, TypeScript" />
            <Field label="Gorsel URL" value={form.image} onChange={v => setForm({...form, image: v})} placeholder="/project.png" />
            <Field label="Video URL" value={form.video} onChange={v => setForm({...form, video: v})} placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aciklama *</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={3}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none cursor-text"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm({...form, active: e.target.checked})}
                className="rounded cursor-pointer"
              />
              Aktif Proje
            </label>
          </div>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
            {loading ? "Ekleniyor..." : "Ekle"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Mevcut Projeler <span className="text-muted-foreground font-normal text-base">({items.length})</span></h2>
        {items.length === 0 ? (
          <div className="border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm bg-card">
            Henuz proje eklenmemis.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(p => (
              <div key={p.id} className="flex items-start justify-between gap-4 border border-border rounded-2xl p-5 bg-card">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="size-4 text-muted-foreground" />
                    <span className="font-semibold">{p.title}</span>
                    {p.href && (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition cursor-pointer">
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                    {!p.active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inaktif</span>
                    )}
                  </div>
                  {p.dates && <div className="text-xs text-muted-foreground">{p.dates}</div>}
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.technologies.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => remove(p.id)}
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

function Field({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm cursor-text" />
    </div>
  );
}
