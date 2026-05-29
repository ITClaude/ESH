import { Link } from "wouter";
import { ArrowLeft, Users, Download, User } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetClass, getGetClassQueryKey } from "@workspace/api-client-react";

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const { lang, t } = useLang();
  const { data: cls, isLoading } = useGetClass(params.id, { query: { queryKey: getGetClassQueryKey(params.id) } });
  const c = cls as any;

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={c?.division === "nursery" ? "/academics/nursery" : "/academics/primary"} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" /> {lang === "fr" ? "Retour" : "Back"}
          </Link>
          {isLoading ? <div className="h-10 bg-white/20 rounded w-32 animate-pulse" /> : (
            <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? `Classe ${c?.classCode}` : `Class ${c?.classCode}`}</h1>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoading ? <div className="space-y-4 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}</div>
        : !c ? <p className="text-center py-20 text-gray-400">{lang === "fr" ? "Classe introuvable" : "Class not found"}</p>
        : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              {c.photoUrl && <img src={c.photoUrl} alt={c.classCode} className="w-full h-48 object-cover rounded-2xl" loading="lazy" />}
              {(c.descFr || c.descEn) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="font-serif text-lg font-bold text-[hsl(var(--primary))] mb-3">{lang === "fr" ? "Description" : "Description"}</h2>
                  <p className="text-gray-600 leading-relaxed">{t(c.descFr, c.descEn)}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {[
                { icon: User, label: lang === "fr" ? "Enseignant(e)" : "Teacher", value: c.teacherName || (lang === "fr" ? "À assigner" : "To be assigned") },
                { icon: Users, label: lang === "fr" ? "Effectif" : "Students", value: `${c.studentCount} ${lang === "fr" ? "élèves" : "students"}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3 bg-[hsl(209,50%,96%)] rounded-xl p-4">
                  <Icon className="w-5 h-5 text-[hsl(var(--primary))] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
                    <div className="text-gray-800 text-sm mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
              {c.timetableUrl && (
                <a href={c.timetableUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-4 bg-[hsl(var(--primary))] text-white rounded-xl hover:opacity-90 transition-opacity" data-testid="link-timetable">
                  <Download className="w-5 h-5" />
                  <span className="text-sm font-medium">{lang === "fr" ? "Emploi du temps" : "Timetable"}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
