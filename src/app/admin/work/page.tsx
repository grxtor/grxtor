"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../layout";
import { Plus, Trash2, Briefcase } from "lucide-react";

interface Work {
  company: string;
  href: string;
  badges: string[];
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description: string;
}

export default function WorkPage() {
  const { password } = useAdminAuth();
  const [items, setItems] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    company: "", title: "", href: "", location: "Remote", logoUrl: "/me.png",
    start: "", end: "", badges: "", description: "",
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/work");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    const item: Work = {
      company: form.company,
      title: form.title,
      href: form.href,
      location: form.location,
      logoUrl: form.logoUrl,
      start: form.start,
      end: form.end,
      badges: form.badges.split(",").map(b => b.trim()).filter(Boolean),
      description: form.description,
    };
    const res = await fetch("/api/admin/work", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      setForm({ company: "", title: "", href: "", location: "Remote", logoUrl: "/me.png", start: "", end: "", badges: "", description: "" });
      setSuccess("Deneyim eklendi!");
      load();
    }
    setLoading(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const remove = async (company: string) => {
    const res = await fetch("/api/admin/work", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ company }),
    });
    if (res.ok) {
      setItems(prev => prev.filter(w => w.company !== company));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Is Deneyimi</h1>
        <p className="text-muted-foreground text-sm mt-1">Deneyimlerini yonet</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">{success}</div>
      )}

      <div className="border border-border rounded-2xl p-6 bg-card space-y-5">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Plus className="size-5" /> Yeni Deneyim Ekle
        </h2>
        <form onSubmit={add} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Sirket Adi *" value={form.company} onChange={v => setForm({...form, company: v})} required />
            <Field label="Pozisyon *" value={form.title} onChange={v => setForm({...form, title: v})} required />
            <Field label="Website URL" value={form.href} onChange={v => setForm({...form, href: v})} />
            <Field label="Konum" value={form.location} onChange={v => setForm({...form, location: v})} />
            <Field label="Logo URL" value={form.logoUrl} onChange={v => setForm({...form, logoUrl: v})} />
            <Field label="Rozetler (virgul)" value={form.badges} onChange={v => setForm({...form, badges: v})} placeholder="Founder, Lead" />
            <Field label="Baslangic Yili *" value={form.start} onChange={v => setForm({...form, start: v})} required />
            <Field label="Bitis Yili" value={form.end} onChange={v => setForm({...form, end: v})} placeholder="Present" />
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
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
            {loading ? "Ekleniyor..." : "Ekle"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Mevcut Deneyimler <span className="text-muted-foreground font-normal text-base">({items.length})</span></h2>
        {items.length === 0 ? (
          <div className="border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm bg-card">
            Henuz deneyim eklenmemis.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(w => (
              <div key={w.company} className="flex items-start justify-between gap-4 border border-border rounded-2xl p-5 bg-card">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 text-muted-foreground" />
                    <span className="font-semibold">{w.company}</span>
                    {w.badges.map(b => (
                      <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{b}</span>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">{w.title} &middot; {w.start} - {w.end || "Present"}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
                </div>
                <button onClick={() => remove(w.company)}
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
