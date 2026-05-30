import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Heart, Award, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";

const VALUES_FR = [
  { icon: GraduationCap, title: "Excellence Académique", desc: "Nous poursuivons les plus hauts standards éducatifs dans toutes les disciplines." },
  { icon: Heart, title: "Compassion", desc: "Chaque enfant est accompagné avec bienveillance et respect de son individualité." },
  { icon: Award, title: "Intégrité", desc: "Nous cultivons la moralité, l'honnêteté et la responsabilité chez nos élèves." },
  { icon: Users, title: "Communauté", desc: "L'ESH est une grande famille où parents, élèves et enseignants collaborent." },
];
const VALUES_EN = [
  { icon: GraduationCap, title: "Academic Excellence", desc: "We pursue the highest educational standards across all disciplines." },
  { icon: Heart, title: "Compassion", desc: "Every child is guided with kindness and respect for their individuality." },
  { icon: Award, title: "Integrity", desc: "We cultivate morality, honesty and responsibility in our students." },
  { icon: Users, title: "Community", desc: "ESH is a big family where parents, students and teachers collaborate." },
];

export default function AboutPage() {
  const { lang } = useLang();
  const values = lang === "fr" ? VALUES_FR : VALUES_EN;

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? "À Propos de l'Ecole Saint Hannibal" : "About Ecole Saint Hannibal"}</h1>
          <p className="text-white/70 mt-2">{lang === "fr" ? "Excellence, Intégrité, Compassion depuis 2008" : "Excellence, Integrity, Compassion since 2008"}</p>
        </div>
      </div>

      {/* Overview */}
      <section className="section-py bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-[hsl(49,87%,50%)] uppercase tracking-widest mb-3">{lang === "fr" ? "Notre Histoire" : "Our Story"}</p>
              <h2 className="font-serif text-3xl font-bold text-[hsl(var(--primary))] mb-5">{lang === "fr" ? "17 Ans d'Excellence Éducative" : "17 Years of Educational Excellence"}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{lang === "fr" ? "Fondée en 2008 par des Soeurs de la Congrégation de Saint Hannibal, l'Ecole Saint Hannibal s'est imposée comme l'une des meilleures écoles bilingues de Kigali. Notre mission est simple : offrir à chaque enfant une éducation de qualité qui développe son plein potentiel." : "Founded in 2008 by Sisters of the Congregation of Saint Hannibal, Ecole Saint Hannibal has established itself as one of the best bilingual schools in Kigali. Our mission is simple: to offer every child a quality education that develops their full potential."}</p>
                <p>{lang === "fr" ? "Avec 290 élèves répartis dans 27 classes — de la Maternelle 1 à la Primaire 6 — nous offrons un environnement stimulant où chaque enfant peut s'épanouir académiquement, socialement et moralement." : "With 290 students across 27 classes — from Nursery 1 to Primary 6 — we offer a stimulating environment where every child can flourish academically, socially and morally."}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "2008", label: lang === "fr" ? "Année de fondation" : "Year founded" },
                { n: "290+", label: lang === "fr" ? "Élèves inscrits" : "Enrolled students" },
                { n: "27", label: lang === "fr" ? "Classes" : "Classes" },
                { n: "32+", label: lang === "fr" ? "Enseignants" : "Teachers" },
              ].map(stat => (
                <div key={stat.n} className="bg-[hsl(209,50%,96%)] rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold font-serif text-[hsl(var(--primary))]">{stat.n}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-py bg-[hsl(210,20%,98%)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-[hsl(var(--primary))]">{lang === "fr" ? "Nos Valeurs Fondamentales" : "Our Core Values"}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA links */}
      <section className="section-py bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: "/about/mission", labelFr: "Mission & Vision", labelEn: "Mission & Vision" },
              { href: "/about/history", labelFr: "Notre Histoire", labelEn: "Our History" },
              { href: "/about/staff", labelFr: "Notre Personnel", labelEn: "Our Staff" },
            ].map(link => (
              <Link key={link.href} href={link.href} className="flex items-center justify-between p-5 bg-[hsl(209,50%,96%)] rounded-xl hover:bg-[hsl(var(--primary))] hover:text-white group transition-colors" data-testid={`about-link-${link.href}`}>
                <span className="font-semibold text-[hsl(var(--primary))] group-hover:text-white transition-colors">{lang === "fr" ? link.labelFr : link.labelEn}</span>
                <ArrowRight className="w-4 h-4 text-[hsl(var(--primary))] group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
