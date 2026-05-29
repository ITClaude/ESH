import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetClasses, getGetClassesQueryKey, useUpdateClass } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, X, Check } from "lucide-react";

function ClassForm({ initial, onSave, onCancel, isLoading }: any) {
  const [form, setForm] = useState(initial || { classCode: "", division: "nursery", descFr: "", descEn: "", studentCount: 0, showOnWebsite: true });
  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Code de classe *</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.classCode} onChange={e => upd("classCode", e.target.value)} required data-testid="input-class-code" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Division</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.division} onChange={e => upd("division", e.target.value)} data-testid="select-division">
            <option value="nursery">Maternelle</option>
            <option value="primary">Primaire</option>
          </select>
        </div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Description (FR)</label><textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={3} value={form.descFr} onChange={e => upd("descFr", e.target.value)} data-testid="input-desc-fr" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Description (EN)</label><textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={3} value={form.descEn} onChange={e => upd("descEn", e.target.value)} data-testid="input-desc-en" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">Nombre d'élèves</label><input type="number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.studentCount} onChange={e => upd("studentCount", Number(e.target.value))} data-testid="input-student-count" /></div>
        <div><label className="block text-xs font-medium text-gray-700 mb-1">URL Emploi du Temps</label><input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={form.timetableUrl || ""} onChange={e => upd("timetableUrl", e.target.value)} data-testid="input-timetable" /></div>
        <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="show" checked={form.showOnWebsite} onChange={e => upd("showOnWebsite", e.target.checked)} data-testid="checkbox-show" /><label htmlFor="show" className="text-sm text-gray-700">Afficher sur le site</label></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-50" data-testid="button-save"><Check className="w-4 h-4" /> {isLoading ? "Enregistrement…" : "Enregistrer"}</button>
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50" data-testid="button-cancel"><X className="w-4 h-4" /> Annuler</button>
      </div>
    </form>
  );
}

export default function AdminClasses() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetClasses({}, { query: { queryKey: getGetClassesQueryKey({}) } });
  const updateMutation = useUpdateClass({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetClassesQueryKey({}) }); setModal(null); } } });
  const [modal, setModal] = useState<null | { item: any }>(null);
  const list = (data as any[]) || [];
  const nursery = list.filter((c: any) => c.division === "nursery");
  const primary = list.filter((c: any) => c.division === "primary");

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-500 text-sm mt-1">{list.length} classe{list.length !== 1 ? "s" : ""} au total</p>
        </div>
        {modal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mb-10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">Modifier la Classe {modal.item.classCode}</h2>
                <button onClick={() => setModal(null)} data-testid="modal-close"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <ClassForm initial={modal.item} onSave={(d: any) => updateMutation.mutate({ id: modal.item.id, data: d })} onCancel={() => setModal(null)} isLoading={updateMutation.isPending} />
              </div>
            </div>
          </div>
        )}
        {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div> : (
          <div className="space-y-8">
            {[{ title: "Section Maternelle", classes: nursery }, { title: "Section Primaire", classes: primary }].map(({ title, classes }) => (
              <div key={title}>
                <h2 className="font-serif text-lg font-semibold text-gray-800 mb-3">{title}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {classes.map((c: any) => (
                    <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow" data-testid={`class-card-${c.id}`}>
                      <div className="text-lg font-bold text-[hsl(var(--primary))]">{c.classCode}</div>
                      <div className="text-xs text-gray-500 mt-1">{c.studentCount} élèves</div>
                      {c.teacherName && <div className="text-xs text-gray-400 mt-0.5 truncate">{c.teacherName}</div>}
                      <button onClick={() => setModal({ item: c })} className="mt-3 w-full py-1 text-xs text-[hsl(var(--primary))] border border-[hsl(var(--primary))] rounded hover:bg-[hsl(209,50%,96%)] flex items-center justify-center gap-1" data-testid={`button-edit-${c.id}`}><Pencil className="w-3 h-3" /> Modifier</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
