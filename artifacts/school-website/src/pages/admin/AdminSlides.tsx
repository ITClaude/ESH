import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetAllSlides, getGetAllSlidesQueryKey, useCreateSlide, useUpdateSlide, useDeleteSlide } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff } from "lucide-react";

function SlideForm({ initial, onSave, onCancel, isLoading }: any) {
  const [form, setForm] = useState(initial || { imageUrl: "", headingFr: "", headingEn: "", subtextFr: "", subtextEn: "", cta1Text: "", cta1Url: "", cta2Text: "", cta2Url: "", orderIndex: 0, isActive: true });
  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">URL de l'image *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.imageUrl} onChange={e => upd("imageUrl", e.target.value)} required placeholder="https://..." data-testid="input-image-url" /></div>
        {form.imageUrl && <div className="md:col-span-2"><img src={form.imageUrl} alt="" className="h-32 w-full object-cover rounded border" /></div>}
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Titre (FR) *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.headingFr} onChange={e => upd("headingFr", e.target.value)} required data-testid="input-heading-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Titre (EN)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.headingEn} onChange={e => upd("headingEn", e.target.value)} data-testid="input-heading-en" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre (FR)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.subtextFr} onChange={e => upd("subtextFr", e.target.value)} data-testid="input-subtext-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Sous-titre (EN)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.subtextEn} onChange={e => upd("subtextEn", e.target.value)} data-testid="input-subtext-en" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Bouton 1 - Texte</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.cta1Text} onChange={e => upd("cta1Text", e.target.value)} data-testid="input-cta1-text" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Bouton 1 - URL</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.cta1Url} onChange={e => upd("cta1Url", e.target.value)} data-testid="input-cta1-url" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Bouton 2 - Texte</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.cta2Text} onChange={e => upd("cta2Text", e.target.value)} data-testid="input-cta2-text" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Bouton 2 - URL</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.cta2Url} onChange={e => upd("cta2Url", e.target.value)} data-testid="input-cta2-url" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Ordre</label><input type="number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.orderIndex} onChange={e => upd("orderIndex", Number(e.target.value))} data-testid="input-order" /></div>
        <div className="flex items-center gap-2 mt-5"><input type="checkbox" id="active" checked={form.isActive} onChange={e => upd("isActive", e.target.checked)} data-testid="checkbox-active" /><label htmlFor="active" className="text-sm text-gray-700">Actif</label></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50" data-testid="button-save"><Check className="w-4 h-4" /> {isLoading ? "Enregistrement…" : "Enregistrer"}</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50" data-testid="button-cancel"><X className="w-4 h-4" /> Annuler</button>
      </div>
    </form>
  );
}

export default function AdminSlides() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetAllSlides({ query: { queryKey: getGetAllSlidesQueryKey() } });
  const createMutation = useCreateSlide({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllSlidesQueryKey() }); setModal(null); } } });
  const updateMutation = useUpdateSlide({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllSlidesQueryKey() }); setModal(null); } } });
  const deleteMutation = useDeleteSlide({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAllSlidesQueryKey() }) } });
  const [modal, setModal] = useState<null | "create" | { type: "edit"; item: any }>(null);
  const list = (data as any[]) || [];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="font-serif text-2xl font-bold text-gray-900">Diaporama Hero</h1><p className="text-gray-500 text-sm mt-1">{list.length} diapositive{list.length !== 1 ? "s" : ""}</p></div>
          <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90" data-testid="button-create-slide"><Plus className="w-4 h-4" /> Nouvelle Diapositive</button>
        </div>
        {modal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mb-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">{modal === "create" ? "Nouvelle Diapositive" : "Modifier"}</h2>
                <button onClick={() => setModal(null)} data-testid="modal-close"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <SlideForm initial={modal !== "create" ? modal.item : undefined} onSave={(d: any) => { if (modal === "create") createMutation.mutate({ data: d }); else updateMutation.mutate({ id: modal.item.id, data: d }); }} onCancel={() => setModal(null)} isLoading={createMutation.isPending || updateMutation.isPending} />
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {isLoading ? <div className="col-span-3 flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
          : list.map((slide: any) => (
            <div key={slide.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`slide-card-${slide.id}`}>
              <div className="relative h-40">
                <img src={slide.imageUrl} alt={slide.headingFr} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                  <div className="text-white text-sm font-medium truncate">{slide.headingFr}</div>
                </div>
                <div className={`absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded-full ${slide.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                  {slide.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {slide.isActive ? "Actif" : "Inactif"}
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">Ordre: {slide.orderIndex}</span>
                <div className="flex gap-1">
                  <button onClick={() => setModal({ type: "edit", item: slide })} className="p-1.5 text-gray-400 hover:text-[hsl(var(--primary))] hover:bg-blue-50 rounded" data-testid={`button-edit-${slide.id}`}><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm("Supprimer?")) deleteMutation.mutate({ id: slide.id }); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" data-testid={`button-delete-${slide.id}`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
