import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";

interface SimplePageProps {
  titleFr: string;
  titleEn: string;
  children: React.ReactNode;
}

export function SimplePage({ titleFr, titleEn, children }: SimplePageProps) {
  const { lang } = useLang();
  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? titleFr : titleEn}</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {children}
      </div>
    </PublicLayout>
  );
}

export function MissionPage() {
  const { lang } = useLang();
  return (
    <SimplePage titleFr="Mission & Vision" titleEn="Mission & Vision">
      <div className="prose prose-lg max-w-none">
        <h2 className="font-serif text-[hsl(var(--primary))]">{lang === "fr" ? "Notre Mission" : "Our Mission"}</h2>
        <p>{lang === "fr"
          ? "L'Ecole Saint Hannibal a pour mission de dispenser une éducation de qualité, bilingue et catholique, qui forme des enfants capables d'affronter les défis du monde moderne avec excellence, intégrité et compassion."
          : "Ecole Saint Hannibal's mission is to provide quality bilingual Catholic education that shapes children capable of facing modern world challenges with excellence, integrity and compassion."}</p>

        <h2 className="font-serif text-[hsl(var(--primary))]">{lang === "fr" ? "Notre Vision" : "Our Vision"}</h2>
        <p>{lang === "fr"
          ? "Être l'école de référence au Rwanda pour la formation intégrale de l'enfant — académiquement rigoureux, moralement fort et socialement responsable."
          : "To be Rwanda's reference school for the integral formation of the child — academically rigorous, morally strong and socially responsible."}</p>

        <h2 className="font-serif text-[hsl(var(--primary))]">{lang === "fr" ? "Nos Objectifs" : "Our Goals"}</h2>
        <ul>
          {(lang === "fr" ? [
            "Former des élèves bilingues maîtrisant le français et l'anglais",
            "Développer l'esprit critique et la créativité",
            "Inculquer les valeurs chrétiennes et citoyennes",
            "Préparer chaque élève pour les études secondaires avec excellence",
            "Favoriser l'épanouissement personnel et social"
          ] : [
            "Train bilingual students mastering French and English",
            "Develop critical thinking and creativity",
            "Instill Christian and civic values",
            "Prepare every student for secondary school with excellence",
            "Promote personal and social development"
          ]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </SimplePage>
  );
}

export function HistoryPage() {
  const { lang } = useLang();
  const TIMELINE = [
    { year: "2008", fr: "Fondation de l'Ecole Saint Hannibal par la Congrégation. Ouverture avec 3 classes maternelles.", en: "Foundation of Ecole Saint Hannibal by the Congregation. Opening with 3 nursery classes." },
    { year: "2010", fr: "Ouverture de la section primaire. Les premières classes P1 et P2 accueillent 45 élèves.", en: "Opening of the primary section. First classes P1 and P2 welcome 45 students." },
    { year: "2013", fr: "Construction du nouveau bâtiment principal. Capacité portée à 150 élèves.", en: "Construction of new main building. Capacity raised to 150 students." },
    { year: "2016", fr: "Accréditation officielle du Ministère de l'Éducation du Rwanda. Prix de l'excellence académique.", en: "Official accreditation from Rwanda Ministry of Education. Academic excellence award." },
    { year: "2019", fr: "Inauguration du laboratoire informatique. 200 élèves inscrits.", en: "Inauguration of computer lab. 200 students enrolled." },
    { year: "2022", fr: "Expansion vers 27 classes. Programme bilingue renforcé. 270 élèves.", en: "Expansion to 27 classes. Enhanced bilingual program. 270 students." },
    { year: "2025", fr: "290+ élèves. Nouveau laboratoire multimédia. Classée parmi les 5 meilleures écoles de Kigali.", en: "290+ students. New multimedia lab. Ranked among the top 5 schools in Kigali." },
  ];

  return (
    <SimplePage titleFr="Notre Histoire" titleEn="Our History">
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[hsl(209,50%,85%)]" />
        <div className="space-y-8">
          {TIMELINE.map((item, i) => (
            <div key={item.year} className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 z-10 shadow-lg">
                {item.year}
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1 mt-3">
                <p className="text-gray-700">{lang === "fr" ? item.fr : item.en}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SimplePage>
  );
}

export function CurriculumPage() {
  const { lang } = useLang();
  const SUBJECTS_FR = [["Français", "Mathématiques", "Anglais", "Sciences", "Histoire-Géo"], ["Informatique", "Éducation Civique", "Religion", "Sports", "Arts & Musique"]];
  const SUBJECTS_EN = [["French", "Mathematics", "English", "Sciences", "History-Geography"], ["Computing", "Civic Education", "Religion", "Sports", "Arts & Music"]];
  const subjects = lang === "fr" ? SUBJECTS_FR : SUBJECTS_EN;

  return (
    <SimplePage titleFr="Programmes & Curriculum" titleEn="Curriculum">
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-serif text-xl font-bold text-[hsl(var(--primary))] mb-4">{lang === "fr" ? "Programme Bilingue" : "Bilingual Curriculum"}</h2>
          <p className="text-gray-600 leading-relaxed">{lang === "fr" ? "Notre programme bilingue intègre le français et l'anglais comme langues d'enseignement dès la maternelle. Toutes les matières sont enseignées dans les deux langues, garantissant une maîtrise complète des deux langues à la fin du cycle primaire." : "Our bilingual program integrates French and English as teaching languages from nursery. All subjects are taught in both languages, ensuring complete mastery of both languages by the end of primary school."}</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-serif text-xl font-bold text-[hsl(var(--primary))] mb-5">{lang === "fr" ? "Matières Enseignées" : "Subjects Taught"}</h2>
          <div className="grid grid-cols-2 gap-3">
            {subjects.flat().map(subj => (
              <div key={subj} className="flex items-center gap-2 text-gray-700 text-sm">
                <div className="w-2 h-2 rounded-full bg-[hsl(49,87%,60%)] flex-shrink-0" />
                {subj}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SimplePage>
  );
}

export function TimetablePage() {
  const { lang } = useLang();
  return (
    <SimplePage titleFr="Emplois du Temps" titleEn="Timetables">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <p className="text-gray-600 mb-6">{lang === "fr" ? "Téléchargez les emplois du temps de chaque section." : "Download timetables for each section."}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/resources" className="px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">{lang === "fr" ? "Télécharger les documents" : "Download documents"}</a>
        </div>
      </div>
    </SimplePage>
  );
}
