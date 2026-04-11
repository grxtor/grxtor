"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Briefcase,
  Zap,
  FileText,
  ArrowRight,
  User,
} from "lucide-react";

interface Stats {
  projects: number;
  work: number;
  skills: number;
  blog: number;
}

const statCards = [
  {
    key: "projects" as const,
    label: "Projeler",
    icon: FolderOpen,
    href: "/admin/projects",
    color: "text-blue-400",
  },
  {
    key: "work" as const,
    label: "Deneyim",
    icon: Briefcase,
    href: "/admin/work",
    color: "text-green-400",
  },
  {
    key: "skills" as const,
    label: "Yetenekler",
    icon: Zap,
    href: "/admin/skills",
    color: "text-yellow-400",
  },
  {
    key: "blog" as const,
    label: "Blog Yazilari",
    icon: FileText,
    href: "/admin/blog",
    color: "text-purple-400",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Genel bakis ve istatistikler
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group border border-border rounded-2xl p-5 bg-card hover:border-primary/30 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`size-5 ${card.color}`} />
              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {stats ? (
                stats[card.key]
              ) : (
                <span className="inline-block w-8 h-8 bg-muted rounded animate-pulse" />
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="border border-border rounded-2xl p-6 bg-card">
        <h2 className="font-semibold text-lg mb-4">Hizli Islemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <FolderOpen className="size-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium">Yeni Proje Ekle</div>
              <div className="text-xs text-muted-foreground">
                Portfolyone proje ekle
              </div>
            </div>
          </Link>
          <Link
            href="/admin/work"
            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Briefcase className="size-5 text-green-400" />
            <div>
              <div className="text-sm font-medium">Deneyim Ekle</div>
              <div className="text-xs text-muted-foreground">
                Is deneyimini guncelle
              </div>
            </div>
          </Link>
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <User className="size-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Profili Duzenle</div>
              <div className="text-xs text-muted-foreground">
                Bio ve sosyal medya
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
