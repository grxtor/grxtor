"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Zap,
  FolderOpen,
  FileText,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const AuthContext = createContext<{ password: string }>({ password: "" });

export function useAdminAuth() {
  return useContext(AuthContext);
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/work", label: "Deneyim", icon: Briefcase },
  { href: "/admin/skills", label: "Yetenekler", icon: Zap },
  { href: "/admin/projects", label: "Projeler", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const pw = sessionStorage.getItem("admin-password");
    if (pw) {
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "x-admin-password": pw },
      }).then((res) => {
        if (res.ok) {
          setAuthed(true);
          setPassword(pw);
        }
        setChecking(false);
      });
    } else {
      setChecking(false);
    }
  }, []);

  const login = async () => {
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      sessionStorage.setItem("admin-password", password);
      setAuthed(true);
    } else {
      setError("Yanlis sifre.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin-password");
    setAuthed(false);
    setPassword("");
  };

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 p-8 border border-border rounded-2xl bg-card shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">
                  GR
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Admin
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              GRXTOR Yonetim Paneli
            </p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Sifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              autoFocus
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              onClick={login}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Giris Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ password }}>
      <div className="min-h-screen bg-background flex">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden size-10 rounded-xl bg-card border border-border flex items-center justify-center cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full z-40 bg-card border-r border-border flex flex-col transition-all duration-300
            ${sidebarOpen ? "w-64" : "w-[72px]"}
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground text-xs font-bold">
                    GR
                  </span>
                </div>
                <span className="font-semibold text-foreground">GRXTOR</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex size-8 rounded-lg hover:bg-muted items-center justify-center cursor-pointer transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    ${
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                >
                  <item.icon className="size-5 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <ExternalLink className="size-5 shrink-0" />
              {sidebarOpen && <span>Siteye Don</span>}
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
            >
              <LogOut className="size-5 shrink-0" />
              {sidebarOpen && <span>Cikis Yap</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-[72px]"
          }`}
        >
          <div className="p-6 pt-20 lg:pt-6 max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </AuthContext.Provider>
  );
}
