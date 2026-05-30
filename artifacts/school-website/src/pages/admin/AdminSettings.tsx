import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetSettingsMap, getGetSettingsMapQueryKey, useBulkUpdateSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Save, Upload, X, ImageIcon } from "lucide-react";

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

function LogoUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 1024 * 1024) {
      setError("L'image est trop grande (max 1 Mo). Essayez de la compresser d'abord.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleUrlSave() {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
    }
  }

  return (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium text-gray-700 mb-3">Logo de l'école</label>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Preview */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden relative group">
            {value ? (
              <>
                <img
                  src={value}
                  alt="Logo"
                  className="w-full h-full object-contain p-2"
                  data-testid="logo-preview"
                />
                <button
                  onClick={() => onChange("")}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Supprimer le logo"
                  data-testid="logo-remove"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                <div className="text-xs">Aucun logo</div>
              </div>
            )}
          </div>
          {value && (
            <p className="text-xs text-green-600 mt-1 text-center">✓ Logo défini</p>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex-1 space-y-4">
          {/* Mode switcher */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${mode === "upload" ? "bg-[hsl(var(--primary))] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Téléverser un fichier
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${mode === "url" ? "bg-[hsl(var(--primary))] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Entrer une URL
            </button>
          </div>

          {mode === "upload" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                className="hidden"
                onChange={handleFile}
                data-testid="logo-file-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))] rounded-lg text-sm hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5 transition-all"
                data-testid="logo-upload-button"
              >
                <Upload className="w-4 h-4" />
                Choisir une image…
              </button>
              <p className="text-xs text-gray-400 mt-2">Formats acceptés : PNG, JPG, SVG, WebP. Max 1 Mo.</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://exemple.com/logo.png"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                data-testid="logo-url-input"
                onKeyDown={e => e.key === "Enter" && handleUrlSave()}
              />
              <button
                type="button"
                onClick={handleUrlSave}
                className="px-3 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm hover:opacity-90"
              >
                OK
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 leading-relaxed">
            Le logo s'affiche dans la barre de navigation et le pied de page du site.
            Sans logo, une icône par défaut est utilisée.
            <br />
            <strong>Conseil :</strong> Utilisez un PNG transparent ou un SVG pour un meilleur rendu.
          </p>
        </div>
      </div>
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
              {/* Logo upload — full width at top */}
              <LogoUploader value={settings.logoUrl ?? ""} onChange={v => upd("logoUrl", v)} />

              <Field label="Nom de l'école (FR)" value={settings.schoolNameFr ?? ""} onChange={v => upd("schoolNameFr", v)} />
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
