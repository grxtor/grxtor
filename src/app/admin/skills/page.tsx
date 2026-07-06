"use client";

import { useState, useEffect } from "react";
import { X, Plus, Save, Loader2, Zap } from "lucide-react";

export default function SkillsPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin/skills").then(r => r.json()).then(setSkills);
  }, []);

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const save = async () => {
    setSaving(true);
    setSuccess("");
    const res = await fetch("/api/admin/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(skills),
    });
    if (res.ok) setSuccess("Kaydedildi!");
    setSaving(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yetenekler</h1>
          <p className="text-muted-foreground text-sm mt-1">Becerilerini yonet</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Kaydet
        </button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">{success}</div>
      )}

      <div className="border border-border rounded-2xl p-6 bg-card space-y-5">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Zap className="size-5 text-yellow-400" /> Yetenek Ekle
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="Ornegin: Python, Docker..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm cursor-text"
          />
          <button onClick={addSkill}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 text-sm font-medium transition cursor-pointer">
            <Plus className="size-4" /> Ekle
          </button>
        </div>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-card space-y-4">
        <h2 className="font-semibold text-lg">Mevcut Yetenekler <span className="text-muted-foreground font-normal text-base">({skills.length})</span></h2>
        {skills.length === 0 ? (
          <p className="text-muted-foreground text-sm">Henuz yetenek eklenmemis.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div key={skill} className="flex items-center gap-2 border border-border bg-background rounded-xl px-3 py-2 text-sm group">
                <span>{skill}</span>
                <button onClick={() => removeSkill(skill)}
                  className="size-5 rounded-full flex items-center justify-center hover:bg-red-400/20 text-muted-foreground hover:text-red-400 transition cursor-pointer">
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
