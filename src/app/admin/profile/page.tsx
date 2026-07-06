"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

interface Social {
  url: string;
  navbar: boolean;
}

interface Profile {
  name: string;
  realName: string;
  initials: string;
  url: string;
  location: string;
  locationLink: string;
  description: string;
  summary: string;
  avatarUrl: string;
  email: string;
  social: Record<string, Social>;
  spotifyArtistId: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin/profile").then(r => r.json()).then(setProfile);
  }, []);

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setSuccess("");
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(profile),
    });
    if (res.ok) setSuccess("Kaydedildi!");
    setSaving(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  if (!profile) return (
    <div className="flex items-center justify-center py-20">
      <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const updateField = (key: keyof Profile, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const updateSocial = (name: string, field: keyof Social, value: string | boolean) => {
    setProfile({
      ...profile,
      social: {
        ...profile.social,
        [name]: { ...profile.social[name], [field]: value },
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
          <p className="text-muted-foreground text-sm mt-1">Kisisel bilgilerini duzenle</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Kaydet
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">
          {success}
        </div>
      )}

      <div className="border border-border rounded-2xl p-6 bg-card space-y-5">
        <h2 className="font-semibold text-lg">Genel Bilgiler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Gorunen Ad" value={profile.name} onChange={v => updateField("name", v)} />
          <Field label="Gercek Ad" value={profile.realName} onChange={v => updateField("realName", v)} />
          <Field label="Kisaltma" value={profile.initials} onChange={v => updateField("initials", v)} />
          <Field label="Website URL" value={profile.url} onChange={v => updateField("url", v)} />
          <Field label="Konum" value={profile.location} onChange={v => updateField("location", v)} />
          <Field label="E-posta" value={profile.email} onChange={v => updateField("email", v)} />
          <Field label="Avatar URL" value={profile.avatarUrl} onChange={v => updateField("avatarUrl", v)} />
          <Field label="Spotify Artist ID" value={profile.spotifyArtistId} onChange={v => updateField("spotifyArtistId", v)} />
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aciklama</label>
            <textarea
              value={profile.description}
              onChange={e => updateField("description", e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none cursor-text"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ozet (Markdown)</label>
            <textarea
              value={profile.summary}
              onChange={e => updateField("summary", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none font-mono cursor-text"
            />
          </div>
        </div>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-card space-y-5">
        <h2 className="font-semibold text-lg">Sosyal Medya</h2>
        <div className="space-y-4">
          {Object.entries(profile.social).map(([name, social]) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-muted-foreground shrink-0">{name}</div>
              <input
                type="text"
                value={social.url}
                onChange={e => updateSocial(name, "url", e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-text"
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={social.navbar}
                  onChange={e => updateSocial(name, "navbar", e.target.checked)}
                  className="rounded cursor-pointer"
                />
                Navbar
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-text"
      />
    </div>
  );
}
