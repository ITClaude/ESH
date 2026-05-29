import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetAdminUsers, getGetAdminUsersQueryKey, useCreateAdminUser, useUpdateAdminUser, useDeleteAdminUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

function UserForm({ initial, onSave, onCancel, isLoading }: any) {
  const [form, setForm] = useState(initial || { name: "", email: "", password: "", role: "editor", isActive: true });
  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const isEdit = !!initial;
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Nom complet *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.name} onChange={e => upd("name", e.target.value)} required data-testid="input-name" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Email *</label><input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.email} onChange={e => upd("email", e.target.value)} required data-testid="input-email" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe {isEdit ? "(laisser vide pour ne pas changer)" : "*"}</label><input type="password" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.password} onChange={e => upd("password", e.target.value)} required={!isEdit} placeholder={isEdit ? "••••••••" : ""} data-testid="input-password" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Rôle</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.role} onChange={e => upd("role", e.target.value)} data-testid="select-role">
            <option value="super">Super Admin</option>
            <option value="editor">Éditeur</option>
            <option value="viewer">Lecteur</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="active" checked={form.isActive} onChange={e => upd("isActive", e.target.checked)} data-testid="checkbox-active" /><label htmlFor="active" className="text-sm text-gray-700">Compte actif</label></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50" data-testid="button-save"><Check className="w-4 h-4" /> {isLoading ? "Enregistrement…" : "Enregistrer"}</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50" data-testid="button-cancel"><X className="w-4 h-4" /> Annuler</button>
      </div>
    </form>
  );
}

export default function AdminUsers() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetAdminUsers({ query: { queryKey: getGetAdminUsersQueryKey() } });
  const createMutation = useCreateAdminUser({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() }); setModal(null); } } });
  const updateMutation = useUpdateAdminUser({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() }); setModal(null); } } });
  const deleteMutation = useDeleteAdminUser({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() }) } });
  const [modal, setModal] = useState<null | "create" | { type: "edit"; item: any }>(null);
  const list = (data as any[]) || [];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="font-serif text-2xl font-bold text-gray-900">Utilisateurs Admin</h1><p className="text-gray-500 text-sm mt-1">{list.length} utilisateur{list.length !== 1 ? "s" : ""}</p></div>
          <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90" data-testid="button-create-user"><Plus className="w-4 h-4" /> Nouvel Utilisateur</button>
        </div>
        {modal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">{modal === "create" ? "Nouvel Utilisateur" : "Modifier"}</h2>
                <button onClick={() => setModal(null)} data-testid="modal-close"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <UserForm initial={modal !== "create" ? modal.item : undefined} onSave={(d: any) => { if (modal === "create") createMutation.mutate({ data: d }); else updateMutation.mutate({ id: modal.item.id, data: d }); }} onCancel={() => setModal(null)} isLoading={createMutation.isPending || updateMutation.isPending} />
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
          : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200"><tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Rôle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Dernière connexion</th>
                <th className="px-4 py-3" />
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50" data-testid={`user-row-${u.id}`}>
                    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{u.name?.[0]}</div><div><div className="font-medium text-gray-800">{u.name}</div><div className={`text-xs ${u.isActive ? "text-green-600" : "text-gray-400"}`}>{u.isActive ? "Actif" : "Inactif"}</div></div></div></td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-gray-600">{u.email}</td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${u.role === "super" ? "bg-purple-100 text-purple-700" : u.role === "editor" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{u.role}</span></td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-gray-400 text-xs">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString("fr-RW") : "Jamais"}</td>
                    <td className="px-4 py-3.5"><div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal({ type: "edit", item: { ...u, password: "" } })} className="p-1.5 text-gray-400 hover:text-[hsl(var(--primary))] hover:bg-blue-50 rounded" data-testid={`button-edit-${u.id}`}><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm("Supprimer cet utilisateur?")) deleteMutation.mutate({ id: u.id }); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" data-testid={`button-delete-${u.id}`}><Trash2 className="w-4 h-4" /></button>
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
