import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  LayoutDashboard, Image, Newspaper, Calendar, GalleryHorizontal,
  Users, School, FileDown, MessageSquare, Settings, UserCog,
  GraduationCap, LogOut, ChevronRight, Activity,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Tableau de Bord", href: "/admin/dashboard" },
  { icon: Image, label: "Diaporama Hero", href: "/admin/slides" },
  { icon: Newspaper, label: "Actualités", href: "/admin/news" },
  { icon: Calendar, label: "Événements", href: "/admin/events" },
  { icon: GalleryHorizontal, label: "Galerie", href: "/admin/gallery" },
  { icon: Users, label: "Personnel", href: "/admin/staff" },
  { icon: School, label: "Classes", href: "/admin/classes" },
  { icon: FileDown, label: "Ressources", href: "/admin/downloads" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: Activity, label: "Activité", href: "/admin/activity" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
  { icon: UserCog, label: "Utilisateurs", href: "/admin/users" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, logout, isLoading, isAuthenticated } = useAdminAuth();
  const [location, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--sidebar-primary))] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-[hsl(209,64%,28%)]" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm leading-tight text-white">ESH Admin</div>
              <div className="text-xs text-white/50 leading-tight">Panneau CMS</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" data-testid="admin-nav">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = location === href || location.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  active
                    ? "bg-[hsl(var(--sidebar-accent))] text-white font-medium"
                    : "text-white/70 hover:bg-[hsl(var(--sidebar-accent))] hover:text-white"
                }`}
                data-testid={`admin-nav-${href.replace("/admin/", "")}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-3 px-3 py-2 rounded mb-2">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--sidebar-primary))] flex items-center justify-center text-[hsl(209,64%,28%)] font-bold text-sm flex-shrink-0">
              {admin?.name?.[0] ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white font-medium truncate">{admin?.name}</div>
              <div className="text-xs text-white/50 truncate capitalize">{admin?.role}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <Link href="/" className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors" data-testid="admin-view-site">
              Site public
            </Link>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-white/60 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
              data-testid="admin-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnecter
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto" data-testid="admin-main">
        {children}
      </main>
    </div>
  );
}
