import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetAllEvents, getGetAllEventsQueryKey, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

function EventForm({ initial, onSave, onCancel, isLoading }: any) {
  const [form, setForm] = useState(initial || {
    titleFr: "", titleEn: "", eventType: "academic",
    startDatetime: "", endDatetime: "", locationFr: "", locationEn: "",
    descriptionFr: "", descriptionEn: "", status: "upcoming", showOnHomepage: false,
  });
  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Titre (FR) *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.titleFr} onChange={e => upd("titleFr", e.target.value)} required data-testid="input-title-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Titre (EN)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.titleEn} onChange={e => upd("titleEn", e.target.value)} data-testid="input-title-en" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.eventType} onChange={e => upd("eventType", e.target.value)} data-testid="select-type">
            {["academic","sports","cultural","holiday","meeting","trip","other"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.status} onChange={e => upd("status", e.target.value)} data-testid="select-status">
            {["upcoming","ongoing","completed","cancelled"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Début *</label><input type="datetime-local" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.startDatetime} onChange={e => upd("startDatetime", e.target.value)} required data-testid="input-start" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Fin</label><input type="datetime-local" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.endDatetime} onChange={e => upd("endDatetime", e.target.value)} data-testid="input-end" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Lieu (FR) *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.locationFr} onChange={e => upd("locationFr", e.target.value)} required data-testid="input-location-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Lieu (EN)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.locationEn} onChange={e => upd("locationEn", e.target.value)} data-testid="input-location-en" /></div>
        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Description (FR)</label><textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={3} value={form.descriptionFr} onChange={e => upd("descriptionFr", e.target.value)} data-testid="input-desc-fr" /></div>
        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Description (EN)</label><textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={3} value={form.descriptionEn} onChange={e => upd("descriptionEn", e.target.value)} data-testid="input-desc-en" /></div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="homepage" checked={form.showOnHomepage} onChange={e => upd("showOnHomepage", e.target.checked)} data-testid="checkbox-homepage" />
          <label htmlFor="homepage" className="text-sm text-gray-700">Afficher sur la page d'accueil</label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50" data-testid="button-save"><Check className="w-4 h-4" /> {isLoading ? "Enregistrement…" : "Enregistrer"}</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50" data-testid="button-cancel"><X className="w-4 h-4" /> Annuler</button>
      </div>
    </form>
  );
}

export default function AdminEvents() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetAllEvents({ query: { queryKey: getGetAllEventsQueryKey() } });
  const createMutation = useCreateEvent({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllEventsQueryKey() }); setModal(null); } } });
  const updateMutation = useUpdateEvent({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllEventsQueryKey() }); setModal(null); } } });
  const deleteMutation = useDeleteEvent({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAllEventsQueryKey() }) } });
  const [modal, setModal] = useState<null | "create" | { type: "edit"; item: any }>(null);
  const list = (data as any[]) || [];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="font-serif text-2xl font-bold text-gray-900">Événements</h1><p className="text-gray-500 text-sm mt-1">{list.length} événement{list.length !== 1 ? "s" : ""}</p></div>
          <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90" data-testid="button-create-event"><Plus className="w-4 h-4" /> Nouvel Événement</button>
        </div>
        {modal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mb-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">{modal === "create" ? "Nouvel Événement" : "Modifier"}</h2>
                <button onClick={() => setModal(null)} data-testid="modal-close"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <EventForm
                  initial={modal !== "create" ? modal.item : undefined}
                  onSave={(d: any) => {
                    if (modal === "create") createMutation.mutate({ data: d });
                    else updateMutation.mutate({ id: modal.item.id, data: d });
                  }}
                  onCancel={() => setModal(null)}
                  isLoading={createMutation.isPending || updateMutation.isPending}
                />
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
          : list.length === 0 ? <p className="text-center py-16 text-gray-400">Aucun événement</p>
          : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Titre</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((e: any) => (
                  <tr key={e.id} className="hover:bg-gray-50" data-testid={`event-row-${e.id}`}>
                    <td className="px-5 py-3.5"><div className="font-medium text-gray-800">{e.titleFr}</div><div className="text-xs text-gray-400">{e.locationFr}</div></td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-gray-600 text-xs">{new Date(e.startDatetime).toLocaleDateString("fr-RW", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className={`text-xs px-2 py-0.5 rounded-full ${e.status === "upcoming" ? "bg-blue-100 text-blue-700" : e.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{e.status}</span></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setModal({ type: "edit", item: { ...e, startDatetime: e.startDatetime ? new Date(e.startDatetime).toISOString().slice(0,16) : "", endDatetime: e.endDatetime ? new Date(e.endDatetime).toISOString().slice(0,16) : "" } })} className="p-1.5 text-gray-400 hover:text-[hsl(var(--primary))] hover:bg-blue-50 rounded" data-testid={`button-edit-${e.id}`}><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm("Supprimer?")) deleteMutation.mutate({ id: e.id }); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" data-testid={`button-delete-${e.id}`}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
