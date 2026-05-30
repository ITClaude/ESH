import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Users, BookOpen } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetClasses, getGetClassesQueryKey } from "@workspace/api-client-react";

export function NurseryPage() {
  return <AcademicsPage division="nursery" />;
}
export function PrimaryPage() {
  return <AcademicsPage division="primary" />;
}

function AcademicsPage({ division }: { division: "nursery" | "primary" }) {
  const { lang, t } = useLang();
  const params = { division };
  const { data, isLoading } = useGetClasses(params, { query: { queryKey: getGetClassesQueryKey(params) } });
  const classes = (data as any[]) || [];

  const isNursery = division === "nursery";

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-[hsl(49,87%,60%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Académique" : "Academic"}</p>
          <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? (isNursery ? "Section Maternelle" : "Section Primaire") : (isNursery ? "Nursery Section" : "Primary Section")}</h1>
          <p className="text-white/70 mt-2">{lang === "fr" ? (isNursery ? "Maternelle 1 à 3 — Un environnement bienveillant pour les tout-petits" : "Primaire 1 à 6 — Excellence académique bilingue") : (isNursery ? "Nursery 1-3 — A nurturing environment for young learners" : "Primary 1-6 — Bilingual academic excellence")}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[hsl(var(--primary))] mb-4">{lang === "fr" ? "Notre Approche" : "Our Approach"}</h2>
              <p className="text-gray-600 leading-relaxed">
                {lang === "fr"
                  ? (isNursery ? "La section maternelle accueille les enfants de 2 à 5 ans dans un environnement chaleureux et stimulant. Notre programme bilingue favorise l'éveil, la créativité et le développement socio-émotionnel de chaque enfant."
                    : "La section primaire offre un programme académique rigoureux pour les enfants de 6 à 12 ans. À travers un curriculum bilingue Français–Anglais, nous développons l'esprit critique, la curiosité intellectuelle et les valeurs citoyennes.")
                  : (isNursery ? "The nursery section welcomes children aged 2-5 in a warm and stimulating environment. Our bilingual program promotes discovery, creativity and socio-emotional development."
                    : "The primary section offers a rigorous academic program for children aged 6-12. Through a bilingual French-English curriculum, we develop critical thinking, intellectual curiosity and citizenship values.")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, value: isNursery ? "9" : "12", label: lang === "fr" ? "Classes" : "Classes" },
                { icon: Users, value: isNursery ? "~110" : "~180", label: lang === "fr" ? "Élèves" : "Students" },
              ].map(s => (
                <div key={s.label} className="bg-[hsl(209,50%,96%)] rounded-xl p-5 text-center">
                  <s.icon className="w-6 h-6 text-[hsl(var(--primary))] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[hsl(var(--primary))]">{s.value}</div>
                  <div className="text-sm text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Classes grid */}
        <h2 className="font-serif text-xl font-bold text-[hsl(var(--primary))] mb-5">{lang === "fr" ? "Nos Classes" : "Our Classes"}</h2>
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">{[...Array(9)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-24" />)}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {classes.map((cls: any, idx: number) => (
              <motion.div key={cls.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.04 }}>
                <Link href={`/academics/classes/${cls.id}`} className="group block bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md hover:border-[hsl(var(--primary))]/30 transition-all" data-testid={`class-card-${cls.id}`}>
                  <div className="text-2xl font-bold font-serif text-[hsl(var(--primary))] group-hover:text-[hsl(209,64%,22%)] transition-colors">{cls.classCode}</div>
                  <div className="text-xs text-gray-500 mt-1">{cls.studentCount} {lang === "fr" ? "élèves" : "students"}</div>
                  {cls.teacherName && <div className="text-xs text-gray-400 mt-0.5 truncate">{cls.teacherName}</div>}
                  <div className="flex items-center justify-center gap-1 text-[hsl(var(--primary))] text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === "fr" ? "Voir" : "View"} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
