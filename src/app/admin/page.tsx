"use client";

import { useState, useEffect, useCallback } from "react";

interface Project {
  title: string;
  href: string;
  dates: string;
  description: string;
  technologies: string[];
  image: string;
  video: string;
  active: boolean;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    href: "",
    dates: "",
    description: "",
    technologies: "",
    image: "",
    video: "",
  });

  const savedPassword =
    typeof window !== "undefined"
      ? sessionStorage.getItem("admin-password") || ""
      : "";

  const loadProjects = useCallback(async (pw: string) => {
    const res = await fetch("/api/projects", {
      headers: { "x-admin-password": pw },
    });
    if (res.ok) {
      setProjects(await res.json());
    }
  }, []);

  useEffect(() => {
    const pw = sessionStorage.getItem("admin-password");
    if (pw) {
      setAuthed(true);
      loadProjects(pw);
    }
  }, [loadProjects]);

  const login = async () => {
    setError("");
    const res = await fetch("/api/projects", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      sessionStorage.setItem("admin-password", password);
      setAuthed(true);
      loadProjects(password);
    } else {
      setError("Şifre yanlış.");
    }
  };

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    const pw = sessionStorage.getItem("admin-password") || "";
    const project: Project = {
      title: form.title,
      href: form.href,
      dates: form.dates,
      description: form.description,
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      image: form.image,
      video: form.video,
      active: true,
    };
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify(project),
    });
    if (res.ok) {
      setForm({ title: "", href: "", dates: "", description: "", technologies: "", image: "", video: "" });
      setSuccess("Proje eklendi!");
      loadProjects(pw);
    }
    setLoading(false);
  };

  const deleteProject = async (title: string) => {
    const pw = sessionStorage.getItem("admin-password") || "";
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify({ title }),
    });
    if (res.ok) loadProjects(pw);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-6 p-8 border border-border rounded-2xl bg-card shadow-xl">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">GRXTOR — Proje Yönetimi</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              onClick={login}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Projelerini buradan yönet</p>
          </div>
          <button
            onClick={() => {
              sessionStorage.clear();
              setAuthed(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition border border-border rounded-xl px-3 py-1.5"
          >
            Çıkış
          </button>
        </div>

        {/* Add Project Form */}
        <div className="border border-border rounded-2xl p-6 space-y-5 bg-card">
          <h2 className="font-semibold text-lg">Yeni Proje Ekle</h2>
          <form onSubmit={addProject} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Proje Adı *"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                placeholder="The Lost Label"
                required
              />
              <Field
                label="Website URL *"
                value={form.href}
                onChange={(v) => setForm({ ...form, href: v })}
                placeholder="https://thelostlabel.com"
                required
              />
              <Field
                label="Tarih"
                value={form.dates}
                onChange={(v) => setForm({ ...form, dates: v })}
                placeholder="2024 - Present"
              />
              <Field
                label="Teknolojiler (virgülle ayır)"
                value={form.technologies}
                onChange={(v) => setForm({ ...form, technologies: v })}
                placeholder="Next.js, TailwindCSS"
              />
              <Field
                label="Görsel URL (opsiyonel)"
                value={form.image}
                onChange={(v) => setForm({ ...form, image: v })}
                placeholder="https://..."
              />
              <Field
                label="Video URL (opsiyonel)"
                value={form.video}
                onChange={(v) => setForm({ ...form, video: v })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Açıklama *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Bu proje hakkında kısa bir açıklama yaz..."
                rows={3}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>
            {success && <p className="text-sm text-green-400">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Ekleniyor..." : "Projeyi Ekle"}
            </button>
          </form>
        </div>

        {/* Project List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">
            Eklenen Projeler{" "}
            <span className="text-muted-foreground font-normal text-base">({projects.length})</span>
          </h2>
          {projects.length === 0 ? (
            <div className="border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
              Henüz proje eklemedin. Yukarıdaki formu kullan!
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.title}
                  className="flex items-start justify-between gap-4 border border-border rounded-2xl p-5 bg-card"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="font-semibold text-foreground leading-none">{p.title}</div>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline break-all"
                    >
                      {p.href}
                    </a>
                    {p.dates && (
                      <div className="text-xs text-muted-foreground">{p.dates}</div>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                    {p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.technologies.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 rounded-full border border-border bg-secondary text-secondary-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteProject(p.title)}
                    className="shrink-0 text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300/50 rounded-xl px-3 py-1.5 transition"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      />
    </div>
  );
}
