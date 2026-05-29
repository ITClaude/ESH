import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetAllStaff, getGetAllStaffQueryKey, useCreateStaff, useUpdateStaff, useDeleteStaff } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

function StaffForm({ initial, onSave, onCancel, isLoading }: any) {
  const [form, setForm] = useState(initial || { fullName: "", roleFr: "", roleEn: "", department: "direction", photoUrl: "", bioFr: "", bioEn: "", email: "", qualifications: "", orderIndex: 0, isActive: true });
  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Nom complet *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.fullName} onChange={e => upd("fullName", e.target.value)} required data-testid="input-full-name" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Rôle (FR) *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.roleFr} onChange={e => upd("roleFr", e.target.value)} required data-testid="input-role-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Role (EN)</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.roleEn} onChange={e => upd("roleEn", e.target.value)} data-testid="input-role-en" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Département *</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.department} onChange={e => upd("department", e.target.value)} data-testid="select-department">
            {["direction","nursery","primary","administration","activities"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Email</label><input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.email} onChange={e => upd("email", e.target.value)} data-testid="input-email" /></div>
        <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">Photo URL</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.photoUrl} onChange={e => upd("photoUrl", e.target.value)} placeholder="https://..." data-testid="input-photo-url" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Bio (FR)</label><textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={3} value={form.bioFr} onChange={e => upd("bioFr", e.target.value)} data-testid="input-bio-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Bio (EN)</label><textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={3} value={form.bioEn} onChange={e => upd("bioEn", e.target.value)} data-testid="input-bio-en" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Qualifications</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.qualifications} onChange={e => upd("qualifications", e.target.value)} data-testid="input-qualifications" /></div>
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

export default function AdminStaff() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetAllStaff({ query: { queryKey: getGetAllStaffQueryKey() } });
  const createMutation = useCreateStaff({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllStaffQueryKey() }); setModal(null); } } });
  const updateMutation = useUpdateStaff({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAllStaffQueryKey() }); setModal(null); } } });
  const deleteMutation = useDeleteStaff({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAllStaffQueryKey() }) } });
  const [modal, setModal] = useState<null | "create" | { type: "edit"; item: any }>(null);
  const list = (data as any[]) || [];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="font-serif text-2xl font-bold text-gray-900">Personnel</h1><p className="text-gray-500 text-sm mt-1">{list.length} membre{list.length !== 1 ? "s" : ""}</p></div>
          <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90" data-testid="button-create-staff"><Plus className="w-4 h-4" /> Nouveau Membre</button>
        </div>
        {modal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mb-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">{modal === "create" ? "Nouveau Membre" : "Modifier"}</h2>
                <button onClick={() => setModal(null)} data-testid="modal-close"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <StaffForm initial={modal !== "create" ? modal.item : undefined} onSave={(d: any) => { if (modal === "create") createMutation.mutate({ data: d }); else updateMutation.mutate({ id: modal.item.id, data: d }); }} onCancel={() => setModal(null)} isLoading={createMutation.isPending || updateMutation.isPending} />
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? <div className="col-span-4 flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
          : list.map((s: any) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`staff-card-${s.id}`}>
              <div className="h-32 bg-gray-100">
                {s.photoUrl ? <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-serif text-gray-300">{s.fullName[0]}</div>}
              </div>
              <div className="p-4">
                <div className="font-medium text-gray-900 text-sm">{s.fullName}</div>
                <div className="text-xs text-[hsl(var(--primary))] mt-0.5">{s.roleFr}</div>
                <div className={`text-xs mt-1 px-1.5 py-0.5 rounded-full inline-block ${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{s.isActive ? "Actif" : "Inactif"}</div>
              </div>
              <div className="px-4 pb-3 flex gap-2">
                <button onClick={() => setModal({ type: "edit", item: s })} className="flex-1 py-1.5 text-xs text-[hsl(var(--primary))] border border-[hsl(var(--primary))] rounded hover:bg-[hsl(209,50%,96%)] flex items-center justify-center gap-1" data-testid={`button-edit-${s.id}`}><Pencil className="w-3 h-3" /> Modifier</button>
                <button onClick={() => { if (confirm("Supprimer?")) deleteMutation.mutate({ id: s.id }); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border border-gray-200" data-testid={`button-delete-${s.id}`}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
