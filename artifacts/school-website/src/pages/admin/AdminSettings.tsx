import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetSettingsMap, getGetSettingsMapQueryKey, useBulkUpdateSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Save } from "lucide-react";

type Tab = "general" | "contact" | "social" | "admissions" | "advanced";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "Général" },
  { id: "contact", label: "Contact" },
  { id: "social", label: "Réseaux sociaux" },
  { id: "admissions", label: "Admissions" },
  { id: "advanced", label: "Avancé" },
];

function Field({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type={type} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

export default function AdminSettings() {
  const qc = useQueryClient();
  const { data: rawSettings, isLoading } = useGetSettingsMap({ query: { queryKey: getGetSettingsMapQueryKey() } });
  const bulkMutation = useBulkUpdateSettings({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getGetSettingsMapQueryKey() }); setSaved(true); setTimeout(() => setSaved(false), 2000); } } });

  const [tab, setTab] = useState<Tab>("general");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (rawSettings) setSettings(rawSettings as Record<string, string>);
  }, [rawSettings]);

  const upd = (k: string, v: string) => setSettings(s => ({ ...s, [k]: v }));

  function handleSave() {
    const settingsArr = Object.entries(settings).map(([key, value]) => ({ key, value }));
    bulkMutation.mutate({ data: { settings: settingsArr } });
  }

  if (isLoading) return <AdminLayout><div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="font-serif text-2xl font-bold text-gray-900">Paramètres du Site</h1><p className="text-gray-500 text-sm mt-1">Configuration générale de l'Ecole Saint Hannibal</p></div>
          <button onClick={handleSave} disabled={bulkMutation.isPending} className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50" data-testid="button-save-settings">
            {saved ? <><Check className="w-4 h-4" /> Enregistré</> : <><Save className="w-4 h-4" /> {bulkMutation.isPending ? "Enregistrement…" : "Enregistrer"}</>}
          </button>
        </div>

        <div className="flex gap-1 mb-6 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm rounded-lg transition-colors ${tab === t.id ? "bg-[hsl(var(--primary))] text-white font-medium" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`} data-testid={`tab-${t.id}`}>{t.label}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {tab === "general" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nom de l'école (FR)" value={settings.schoolNameFr ?? ""} onChange={v => upd("schoolNameFr", v)} data-testid="input-school-name-fr" />
              <Field label="School Name (EN)" value={settings.schoolNameEn ?? ""} onChange={v => upd("schoolNameEn", v)} />
              <Field label="Devise (FR)" value={settings.taglineFr ?? ""} onChange={v => upd("taglineFr", v)} />
              <Field label="Tagline (EN)" value={settings.taglineEn ?? ""} onChange={v => upd("taglineEn", v)} />
              <Field label="Année académique" value={settings.currentAcademicYear ?? ""} onChange={v => upd("currentAcademicYear", v)} placeholder="2025–2026" />
              <Field label="Nombre d'élèves affiché" value={settings.totalStudentsDisplay ?? ""} onChange={v => upd("totalStudentsDisplay", v)} type="number" />
              <Field label="Message du Directeur (FR)" value={settings.directorMessageFr ?? ""} onChange={v => upd("directorMessageFr", v)} type="textarea" />
              <Field label="Director Message (EN)" value={settings.directorMessageEn ?? ""} onChange={v => upd("directorMessageEn", v)} type="textarea" />
              <Field label="Nom du Directeur" value={settings.directorNameFr ?? ""} onChange={v => upd("directorNameFr", v)} />
              <Field label="Titre du Directeur (FR)" value={settings.directorTitleFr ?? ""} onChange={v => upd("directorTitleFr", v)} />
            </div>
          )}
          {tab === "contact" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Téléphone 1" value={settings.phone1 ?? ""} onChange={v => upd("phone1", v)} type="tel" />
              <Field label="Téléphone 2" value={settings.phone2 ?? ""} onChange={v => upd("phone2", v)} type="tel" />
              <Field label="Email Général" value={settings.emailGeneral ?? ""} onChange={v => upd("emailGeneral", v)} type="email" />
              <Field label="Email Admissions" value={settings.emailAdmissions ?? ""} onChange={v => upd("emailAdmissions", v)} type="email" />
              <Field label="Adresse (FR)" value={settings.addressFr ?? ""} onChange={v => upd("addressFr", v)} />
              <Field label="Address (EN)" value={settings.addressEn ?? ""} onChange={v => upd("addressEn", v)} />
              <Field label="Heures d'ouverture (FR)" value={settings.officeHoursFr ?? ""} onChange={v => upd("officeHoursFr", v)} />
              <Field label="Office Hours (EN)" value={settings.officeHoursEn ?? ""} onChange={v => upd("officeHoursEn", v)} />
              <div className="md:col-span-2"><Field label="URL Intégration Google Maps" value={settings.mapsEmbedUrl ?? ""} onChange={v => upd("mapsEmbedUrl", v)} placeholder="https://www.google.com/maps/embed?..." /></div>
            </div>
          )}
          {tab === "social" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Facebook URL" value={settings.facebookUrl ?? ""} onChange={v => upd("facebookUrl", v)} placeholder="https://facebook.com/..." />
              <Field label="YouTube URL" value={settings.youtubeUrl ?? ""} onChange={v => upd("youtubeUrl", v)} placeholder="https://youtube.com/..." />
              <Field label="Numéro WhatsApp (avec indicatif)" value={settings.whatsappNumber ?? ""} onChange={v => upd("whatsappNumber", v)} placeholder="+250788..." />
            </div>
          )}
          {tab === "admissions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="admissions-open" checked={settings.admissionsOpen === "true"} onChange={e => upd("admissionsOpen", e.target.checked ? "true" : "false")} data-testid="checkbox-admissions-open" />
                <label htmlFor="admissions-open" className="text-sm font-medium text-gray-700">Admissions ouvertes</label>
              </div>
            </div>
          )}
          {tab === "advanced" && (
            <div className="grid grid-cols-1 gap-5">
              <Field label="Bannière d'annonce" value={settings.announcementBanner ?? ""} onChange={v => upd("announcementBanner", v)} type="textarea" />
              <div className="flex items-center gap-3">
                <input type="checkbox" id="banner-active" checked={settings.announcementActive === "true"} onChange={e => upd("announcementActive", e.target.checked ? "true" : "false")} data-testid="checkbox-banner-active" />
                <label htmlFor="banner-active" className="text-sm font-medium text-gray-700">Afficher la bannière d'annonce</label>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
