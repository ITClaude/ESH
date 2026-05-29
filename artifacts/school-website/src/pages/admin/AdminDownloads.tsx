import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetAllDownloads, getGetAllDownloadsQueryKey, useCreateDownload, useUpdateDownload, useDeleteDownload } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

function DownloadForm({ initial, onSave, onCancel, isLoading }: any) {
  const [form, setForm] = useState(initial || { titleFr: "", titleEn: "", fileUrl: "", fileType: "pdf", category: "", publishDate: new Date().toISOString().slice(0,10), isActive: true });
  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Titre (FR) *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.titleFr} onChange={e => upd("titleFr", e.target.value)} required data-testid="input-title-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Title (EN)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.titleEn} onChange={e => upd("titleEn", e.target.value)} data-testid="input-title-en" /></div>
        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">URL du fichier *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.fileUrl} onChange={e => upd("fileUrl", e.target.value)} required placeholder="/files/document.pdf" data-testid="input-file-url" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Type de fichier</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.fileType} onChange={e => upd("fileType", e.target.value)} placeholder="pdf, docx, xlsx..." data-testid="input-file-type" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Catégorie</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.category} onChange={e => upd("category", e.target.value)} data-testid="input-category" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Date de publication</label><input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.publishDate} onChange={e => upd("publishDate", e.target.value)} data-testid="input-publish-date" /></div>
        <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="active" checked={form.isActive} onChange={e => upd("isActive", e.target.checked)} data-testid="checkbox-active" /><label htmlFor="active" className="text-sm text-gray-700">Actif</label></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50" data-testid="button-save"><Check className="w-4 h-4" /> {isLoading ? "Enregistrement…" : "Enregistrer"}</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50" data-testid="button-cancel"><X className="w-4 h-4" /> Annuler</button>
      </div>
    </form>
  );
}

export default function AdminDownloads() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetAllDownloads({ query: { queryKey: getGetAllDownloadsQueryKey() } });
  const createMutation = useCreateDownload({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllDownloadsQueryKey() }); setModal(null); } } });
  const updateMutation = useUpdateDownload({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllDownloadsQueryKey() }); setModal(null); } } });
  const deleteMutation = useDeleteDownload({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAllDownloadsQueryKey() }) } });
  const [modal, setModal] = useState<null | "create" | { type: "edit"; item: any }>(null);
  const list = (data as any[]) || [];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="font-serif text-2xl font-bold text-gray-900">Ressources</h1><p className="text-gray-500 text-sm mt-1">{list.length} document{list.length !== 1 ? "s" : ""}</p></div>
          <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90" data-testid="button-create-download"><Plus className="w-4 h-4" /> Nouveau Document</button>
        </div>
        {modal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mb-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">{modal === "create" ? "Nouveau Document" : "Modifier"}</h2>
                <button onClick={() => setModal(null)} data-testid="modal-close"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <DownloadForm initial={modal !== "create" ? modal.item : undefined} onSave={(d: any) => { if (modal === "create") createMutation.mutate({ data: d }); else updateMutation.mutate({ id: modal.item.id, data: d }); }} onCancel={() => setModal(null)} isLoading={createMutation.isPending || updateMutation.isPending} />
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
          : list.length === 0 ? <p className="text-center py-16 text-gray-400">Aucun document</p>
          : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200"><tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Titre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Statut</th>
                <th className="px-4 py-3" />
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((d: any) => (
                  <tr key={d.id} className="hover:bg-gray-50" data-testid={`download-row-${d.id}`}>
                    <td className="px-5 py-3.5"><div className="font-medium text-gray-800">{d.titleFr}</div><div className="text-xs text-gray-400">{d.fileType?.toUpperCase()} · {d.publishDate}</div></td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-gray-600 text-xs capitalize">{d.category}</td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className={`text-xs px-2 py-0.5 rounded-full ${d.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{d.isActive ? "Actif" : "Inactif"}</span></td>
                    <td className="px-4 py-3.5"><div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal({ type: "edit", item: d })} className="p-1.5 text-gray-400 hover:text-[hsl(var(--primary))] hover:bg-blue-50 rounded" data-testid={`button-edit-${d.id}`}><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm("Supprimer?")) deleteMutation.mutate({ id: d.id }); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" data-testid={`button-delete-${d.id}`}><Trash2 className="w-4 h-4" /></button>
                    </div></td>
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
