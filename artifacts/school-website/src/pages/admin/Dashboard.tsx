import { AdminLayout } from "@/components/AdminLayout";
import {
  useGetDashboardOverview,
  getGetDashboardOverviewQueryKey,
} from "@workspace/api-client-react";
import {
  Users, Newspaper, Calendar, GalleryHorizontal,
  MessageSquare, School, FileDown, Activity,
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: overview, isLoading } = useGetDashboardOverview({
    query: { queryKey: getGetDashboardOverviewQueryKey() },
  });

  const stats = (overview as any)?.stats;
  const recentNews = (overview as any)?.recentNews ?? [];
  const upcomingEvents = (overview as any)?.upcomingEvents ?? [];
  const recentActivity = (overview as any)?.recentActivity ?? [];

  const statCards = [
    { icon: Users, label: "Élèves", value: stats?.totalStudents ?? "—", href: "/admin/classes", color: "bg-blue-50 text-blue-700" },
    { icon: School, label: "Classes", value: stats?.totalClasses ?? "—", href: "/admin/classes", color: "bg-indigo-50 text-indigo-700" },
    { icon: Users, label: "Personnel", value: stats?.totalStaff ?? "—", href: "/admin/staff", color: "bg-violet-50 text-violet-700" },
    { icon: Newspaper, label: "Articles", value: stats?.totalNews ?? "—", href: "/admin/news", color: "bg-emerald-50 text-emerald-700" },
    { icon: Calendar, label: "Événements", value: stats?.totalEvents ?? "—", href: "/admin/events", color: "bg-amber-50 text-amber-700" },
    { icon: GalleryHorizontal, label: "Albums", value: stats?.totalAlbums ?? "—", href: "/admin/gallery", color: "bg-pink-50 text-pink-700" },
    { icon: MessageSquare, label: "Messages non lus", value: stats?.pendingMessages ?? "—", href: "/admin/messages", color: "bg-red-50 text-red-700" },
    { icon: FileDown, label: "Documents", value: stats?.totalDownloads ?? "—", href: "/admin/downloads", color: "bg-teal-50 text-teal-700" },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d'ensemble du site Ecole Saint Hannibal</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map(({ icon: Icon, label, value, href, color }) => (
                <Link key={href + label} href={href}>
                  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer" data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{label}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Two-col: recent news + upcoming events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Recent news */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 text-sm">Dernières Actualités</h2>
                  <Link href="/admin/news" className="text-xs text-[hsl(var(--primary))] hover:underline">Voir tout</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {recentNews.length === 0 && <p className="px-5 py-8 text-sm text-gray-400 text-center">Aucun article</p>}
                  {recentNews.map((n: any) => (
                    <div key={n.id} className="px-5 py-3.5 flex items-start gap-3" data-testid={`news-row-${n.id}`}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{n.titleFr}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{n.author} · {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString("fr-RW") : "—"}</div>
                      </div>
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${n.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {n.status === "published" ? "Publié" : n.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming events */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 text-sm">Prochains Événements</h2>
                  <Link href="/admin/events" className="text-xs text-[hsl(var(--primary))] hover:underline">Voir tout</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {upcomingEvents.length === 0 && <p className="px-5 py-8 text-sm text-gray-400 text-center">Aucun événement</p>}
                  {upcomingEvents.map((e: any) => (
                    <div key={e.id} className="px-5 py-3.5" data-testid={`event-row-${e.id}`}>
                      <div className="text-sm font-medium text-gray-800">{e.titleFr}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(e.startDatetime).toLocaleDateString("fr-RW", { day: "numeric", month: "short", year: "numeric" })} · {e.locationFr}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Journal d'Activité
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {recentActivity.length === 0 && <p className="px-5 py-8 text-sm text-gray-400 text-center">Aucune activité</p>}
                {recentActivity.slice(0, 8).map((a: any) => (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-3" data-testid={`activity-row-${a.id}`}>
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-700">{a.description || `${a.action} ${a.entityType}`}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{a.adminName}</span>
                    <span className="text-xs text-gray-300 flex-shrink-0">{new Date(a.createdAt).toLocaleDateString("fr-RW")}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
