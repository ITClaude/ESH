import { AdminLayout } from "@/components/AdminLayout";
import { useGetActivityLog, getGetActivityLogQueryKey } from "@workspace/api-client-react";
import { Activity } from "lucide-react";

export default function AdminActivity() {
  const { data, isLoading } = useGetActivityLog({}, { query: { queryKey: getGetActivityLogQueryKey({}) } });
  const list = (data as any[]) || [];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-gray-900">Journal d'Activité</h1>
          <p className="text-gray-500 text-sm mt-1">{list.length} entrée{list.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
          : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Activity className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Aucune activité enregistrée</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {list.map((a: any) => (
                <div key={a.id} className="px-5 py-3.5 flex items-center gap-4" data-testid={`activity-${a.id}`}>
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-800">{a.description || `${a.action} ${a.entityType}${a.entityId ? ` (${a.entityId})` : ""}`}</span>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500">{a.adminName}</div>
                  <div className="flex-shrink-0 text-xs text-gray-300">{new Date(a.createdAt).toLocaleString("fr-RW")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
