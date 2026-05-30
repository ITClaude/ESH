import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetAllAlbums, getGetAllAlbumsQueryKey, useGetAlbum, getGetAlbumQueryKey, useCreateAlbum, useUpdateAlbum, useDeleteAlbum, useCreateGalleryItem, useDeleteGalleryItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Check, ArrowLeft, Image } from "lucide-react";

function AlbumForm({ initial, onSave, onCancel, isLoading }: any) {
  const [form, setForm] = useState(initial || { nameFr: "", nameEn: "", category: "academic", eventDate: "", coverImage: "", descriptionFr: "", descriptionEn: "", isVisible: true });
  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Nom (FR) *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.nameFr} onChange={e => upd("nameFr", e.target.value)} required data-testid="input-name-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Name (EN)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.nameEn} onChange={e => upd("nameEn", e.target.value)} data-testid="input-name-en" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Catégorie</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.category} onChange={e => upd("category", e.target.value)} data-testid="input-category" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Date de l'événement *</label><input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.eventDate} onChange={e => upd("eventDate", e.target.value)} required data-testid="input-event-date" /></div>
        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Image de couverture (URL)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.coverImage} onChange={e => upd("coverImage", e.target.value)} placeholder="https://..." data-testid="input-cover" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Description (FR)</label><textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={2} value={form.descriptionFr} onChange={e => upd("descriptionFr", e.target.value)} data-testid="input-desc-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Description (EN)</label><textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={2} value={form.descriptionEn} onChange={e => upd("descriptionEn", e.target.value)} data-testid="input-desc-en" /></div>
        <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="visible" checked={form.isVisible} onChange={e => upd("isVisible", e.target.checked)} data-testid="checkbox-visible" /><label htmlFor="visible" className="text-sm text-gray-700">Visible au public</label></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50" data-testid="button-save"><Check className="w-4 h-4" /> {isLoading ? "Enregistrement…" : "Enregistrer"}</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50" data-testid="button-cancel"><X className="w-4 h-4" /> Annuler</button>
      </div>
    </form>
  );
}

function AlbumDetail({ albumId, onBack }: { albumId: string; onBack: () => void }) {
  const qc = useQueryClient();
  const { data: album, isLoading } = useGetAlbum(albumId, { query: { queryKey: getGetAlbumQueryKey(albumId) } });
  const addItemMutation = useCreateGalleryItem({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAlbumQueryKey(albumId) }) } });
  const deleteItemMutation = useDeleteGalleryItem({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAlbumQueryKey(albumId) }) } });
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");

  const data = album as any;
  const items = data?.items || [];

  function addItem() {
    if (!newUrl.trim()) return;
    addItemMutation.mutate({ albumId, data: { mediaUrl: newUrl, captionFr: newCaption || undefined, mediaType: "photo", orderIndex: items.length } });
    setNewUrl(""); setNewCaption("");
  }

  return (
    <div className="p-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[hsl(var(--primary))] hover:underline mb-6" data-testid="button-back-albums">
        <ArrowLeft className="w-4 h-4" /> Retour aux albums
      </button>
      {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div> : (
        <>
          <div className="flex items-center gap-4 mb-6">
            {data?.coverImage && <img src={data.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover" />}
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">{data?.nameFr}</h1>
              <p className="text-gray-500 text-sm mt-1">{items.length} photo{items.length !== 1 ? "s" : ""} · {data?.eventDate}</p>
            </div>
          </div>
          {/* Add photo */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h3 className="font-medium text-gray-800 text-sm mb-3">Ajouter une photo</h3>
            <div className="flex gap-3">
              <input className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" placeholder="URL de l'image..." value={newUrl} onChange={e => setNewUrl(e.target.value)} data-testid="input-new-photo-url" />
              <input className="w-48 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" placeholder="Légende (optionnel)" value={newCaption} onChange={e => setNewCaption(e.target.value)} data-testid="input-new-photo-caption" />
              <button onClick={addItem} disabled={addItemMutation.isPending} className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2" data-testid="button-add-photo">
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
          </div>
          {/* Photo grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((item: any) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100" data-testid={`gallery-item-${item.id}`}>
                <img src={item.mediaUrl} alt={item.captionFr || ""} className="w-full h-full object-cover" loading="lazy" />
                {item.captionFr && <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 text-center truncate">{item.captionFr}</div>}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => { if (confirm("Supprimer?")) deleteItemMutation.mutate({ id: item.id }); }} className="p-2 bg-red-500 text-white rounded-full" data-testid={`button-delete-item-${item.id}`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminGallery() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetAllAlbums({ query: { queryKey: getGetAllAlbumsQueryKey() } });
  const createMutation = useCreateAlbum({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllAlbumsQueryKey() }); setModal(null); } } });
  const updateMutation = useUpdateAlbum({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllAlbumsQueryKey() }); setModal(null); } } });
  const deleteMutation = useDeleteAlbum({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAllAlbumsQueryKey() }) } });
  const [modal, setModal] = useState<null | "create" | { type: "edit"; item: any }>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const list = (data as any[]) || [];

  if (selectedAlbumId) {
    return <AdminLayout><AlbumDetail albumId={selectedAlbumId} onBack={() => setSelectedAlbumId(null)} /></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="font-serif text-2xl font-bold text-gray-900">Galerie</h1><p className="text-gray-500 text-sm mt-1">{list.length} album{list.length !== 1 ? "s" : ""}</p></div>
          <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90" data-testid="button-create-album"><Plus className="w-4 h-4" /> Nouvel Album</button>
        </div>
        {modal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mb-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">{modal === "create" ? "Nouvel Album" : "Modifier"}</h2>
                <button onClick={() => setModal(null)} data-testid="modal-close"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <AlbumForm initial={modal !== "create" ? modal.item : undefined} onSave={(d: any) => { if (modal === "create") createMutation.mutate({ data: d }); else updateMutation.mutate({ id: modal.item.id, data: d }); }} onCancel={() => setModal(null)} isLoading={createMutation.isPending || updateMutation.isPending} />
              </div>
            </div>
          </div>
        )}
        {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((a: any) => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group cursor-pointer" onClick={() => setSelectedAlbumId(a.id)} data-testid={`album-card-${a.id}`}>
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  {a.coverImage ? <img src={a.coverImage} alt={a.nameFr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><Image className="w-12 h-12 text-gray-300" /></div>}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  {!a.isVisible && <div className="absolute top-2 left-2 text-xs bg-gray-800/80 text-white px-2 py-0.5 rounded-full">Masqué</div>}
                </div>
                <div className="p-4">
                  <div className="font-medium text-gray-900 text-sm">{a.nameFr}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{a.itemCount} photo{a.itemCount !== 1 ? "s" : ""} · {a.eventDate}</div>
                </div>
                <div className="px-4 pb-3 flex gap-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setModal({ type: "edit", item: a })} className="flex-1 py-1.5 text-xs text-[hsl(var(--primary))] border border-[hsl(var(--primary))] rounded hover:bg-[hsl(209,50%,96%)] flex items-center justify-center gap-1" data-testid={`button-edit-${a.id}`}><Pencil className="w-3 h-3" /> Modifier</button>
                  <button onClick={() => { if (confirm("Supprimer l'album?")) deleteMutation.mutate({ id: a.id }); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border border-gray-200" data-testid={`button-delete-${a.id}`}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
