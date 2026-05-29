import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetAllNews, getGetAllNewsQueryKey, useCreateNews, useUpdateNews, useDeleteNews } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

function NewsForm({ initial, onSave, onCancel, isLoading }: { initial?: any; onSave: (d: any) => void; onCancel: () => void; isLoading: boolean }) {
  const [form, setForm] = useState(initial || { titleFr: "", titleEn: "", excerptFr: "", excerptEn: "", bodyFr: "", bodyEn: "", category: "", author: "", featuredImage: "", status: "draft" });
  const upd = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Titre (FR) *</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.titleFr} onChange={e => upd("titleFr", e.target.value)} required data-testid="input-title-fr" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Titre (EN)</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.titleEn} onChange={e => upd("titleEn", e.target.value)} data-testid="input-title-en" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Extrait (FR) *</label>
          <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={2} value={form.excerptFr} onChange={e => upd("excerptFr", e.target.value)} required data-testid="input-excerpt-fr" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Extrait (EN)</label>
          <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={2} value={form.excerptEn} onChange={e => upd("excerptEn", e.target.value)} data-testid="input-excerpt-en" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Corps de l'article (FR) *</label>
          <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] font-mono" rows={8} value={form.bodyFr} onChange={e => upd("bodyFr", e.target.value)} required placeholder="Supporte HTML basique" data-testid="input-body-fr" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Corps (EN)</label>
          <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] font-mono" rows={8} value={form.bodyEn} onChange={e => upd("bodyEn", e.target.value)} placeholder="Supports basic HTML" data-testid="input-body-en" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Catégorie</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.category} onChange={e => upd("category", e.target.value)} data-testid="input-category" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Auteur *</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.author} onChange={e => upd("author", e.target.value)} required data-testid="input-author" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Image mise en avant (URL)</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.featuredImage} onChange={e => upd("featuredImage", e.target.value)} data-testid="input-featured-image" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.status} onChange={e => upd("status", e.target.value)} data-testid="select-status">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50" data-testid="button-save">
          <Check className="w-4 h-4" /> {isLoading ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50" data-testid="button-cancel">
          <X className="w-4 h-4" /> Annuler
        </button>
      </div>
    </form>
  );
}

export default function AdminNews() {
  const qc = useQueryClient();
  const { data: articles, isLoading } = useGetAllNews({}, { query: { queryKey: getGetAllNewsQueryKey({}) } });
  const createMutation = useCreateNews({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllNewsQueryKey({}) }); setModal(null); } } });
  const updateMutation = useUpdateNews({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllNewsQueryKey({}) }); setModal(null); } } });
  const deleteMutation = useDeleteNews({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAllNewsQueryKey({}) }) } });

  const [modal, setModal] = useState<null | "create" | { type: "edit"; item: any }>(null);

  const list = (articles as any[]) || [];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">Actualités</h1>
            <p className="text-gray-500 text-sm mt-1">{list.length} article{list.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90" data-testid="button-create-news">
            <Plus className="w-4 h-4" /> Nouvel Article
          </button>
        </div>

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mb-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">{modal === "create" ? "Nouvel Article" : "Modifier l'Article"}</h2>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700" data-testid="modal-close"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <NewsForm
                  initial={modal !== "create" ? modal.item : undefined}
                  onSave={(d) => {
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
          {isLoading ? (
            <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
          ) : list.length === 0 ? (
            <p className="text-center py-16 text-gray-400">Aucun article</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Titre</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Auteur</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Statut</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((a: any) => (
                  <tr key={a.id} className="hover:bg-gray-50" data-testid={`news-row-${a.id}`}>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-800 truncate max-w-xs">{a.titleFr}</div>
                      {a.titleEn && <div className="text-xs text-gray-400 truncate max-w-xs">{a.titleEn}</div>}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-gray-600">{a.author}</td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === "published" ? "bg-green-100 text-green-700" : a.status === "draft" ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-700"}`}>
                        {a.status === "published" ? "Publié" : a.status === "draft" ? "Brouillon" : "Archivé"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-gray-400 text-xs">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("fr-RW") : "—"}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setModal({ type: "edit", item: a })} className="p-1.5 text-gray-400 hover:text-[hsl(var(--primary))] hover:bg-blue-50 rounded" data-testid={`button-edit-${a.id}`}><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm("Supprimer cet article?")) deleteMutation.mutate({ id: a.id }); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" data-testid={`button-delete-${a.id}`}><Trash2 className="w-4 h-4" /></button>
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
