import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Calendar } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetDownloads, getGetDownloadsQueryKey } from "@workspace/api-client-react";

const CATEGORIES = [
  { value: "", labelFr: "Tous", labelEn: "All" },
  { value: "admissions", labelFr: "Admissions", labelEn: "Admissions" },
  { value: "calendrier", labelFr: "Calendrier", labelEn: "Calendar" },
  { value: "emplois-du-temps", labelFr: "Emplois du temps", labelEn: "Timetables" },
  { value: "reglement", labelFr: "Règlement", labelEn: "Regulations" },
  { value: "prospectus", labelFr: "Prospectus", labelEn: "Prospectus" },
];

export default function ResourcesPage() {
  const { lang, t } = useLang();
  const [category, setCategory] = useState("");
  const params = category ? { category } : {};
  const { data, isLoading } = useGetDownloads(params, { query: { queryKey: getGetDownloadsQueryKey(params) } });
  const downloads = (data as any[]) || [];

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-[hsl(49,87%,60%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Centre de Documents" : "Document Center"}</p>
          <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? "Ressources & Documents" : "Resources & Documents"}</h1>
          <p className="text-white/70 mt-2">{lang === "fr" ? "Tous les documents importants de l'école" : "All important school documents"}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)} className={`px-4 py-2 rounded-full text-sm transition-colors ${category === c.value ? "bg-[hsl(var(--primary))] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[hsl(var(--primary))]"}`} data-testid={`filter-${c.value || "all"}`}>
              {lang === "fr" ? c.labelFr : c.labelEn}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-16" />)}</div>
        ) : downloads.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{lang === "fr" ? "Aucun document disponible" : "No documents available"}</div>
        ) : (
          <div className="space-y-3">
            {downloads.map((dl: any, idx: number) => (
              <motion.div key={dl.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <a href={dl.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[hsl(var(--primary))]/30 transition-all group" data-testid={`download-${dl.id}`}>
                  <div className="w-10 h-10 rounded-lg bg-[hsl(209,50%,96%)] flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(var(--primary))] transition-colors">
                    <FileText className="w-5 h-5 text-[hsl(var(--primary))] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{t(dl.titleFr, dl.titleEn)}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      {dl.fileType && <span className="uppercase font-medium">{dl.fileType}</span>}
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{dl.publishDate}</div>
                      <span className="capitalize">{dl.category}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-[hsl(209,50%,96%)] flex items-center justify-center group-hover:bg-[hsl(var(--primary))] transition-colors">
                      <Download className="w-4 h-4 text-[hsl(var(--primary))] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
