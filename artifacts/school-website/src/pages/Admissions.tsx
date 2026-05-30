import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, Download, FileText, Phone, Mail } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetSettingsMap, getGetSettingsMapQueryKey } from "@workspace/api-client-react";

const STEPS_FR = [
  { title: "Obtenir le dossier d'inscription", desc: "Téléchargez ou récupérez le dossier de candidature au secrétariat." },
  { title: "Remplir le formulaire", desc: "Complétez toutes les sections du formulaire de candidature avec soin." },
  { title: "Rassembler les documents", desc: "Préparez tous les documents requis listés ci-dessous." },
  { title: "Déposer le dossier complet", desc: "Soumettez votre dossier complet au secrétariat de l'école." },
  { title: "Entretien & décision", desc: "Vous serez contacté pour un entretien. Une décision est prise sous 5 jours ouvrables." },
];

const STEPS_EN = [
  { title: "Get the enrollment form", desc: "Download or collect the application form from the school office." },
  { title: "Complete the form", desc: "Fill in all sections of the application form carefully." },
  { title: "Gather the documents", desc: "Prepare all required documents listed below." },
  { title: "Submit the complete file", desc: "Submit your complete application file to the school office." },
  { title: "Interview & decision", desc: "You will be contacted for an interview. A decision is made within 5 business days." },
];

const DOCS_FR = ["Acte de naissance (copie certifiée)", "Carnet de vaccinations à jour", "Bulletin scolaire de l'année précédente", "2 photos d'identité récentes", "Photocopie de la carte nationale de l'un des parents", "Preuve de paiement des frais d'inscription"];
const DOCS_EN = ["Birth certificate (certified copy)", "Up-to-date vaccination record", "Previous year school report", "2 recent passport photos", "Photocopy of one parent's ID card", "Proof of registration fee payment"];

export default function AdmissionsPage() {
  const { lang } = useLang();
  const { data: settings } = useGetSettingsMap({ query: { queryKey: getGetSettingsMapQueryKey() } });
  const s: Record<string, string> = (settings as any) || {};
  const steps = lang === "fr" ? STEPS_FR : STEPS_EN;
  const docs = lang === "fr" ? DOCS_FR : DOCS_EN;

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-[hsl(49,87%,60%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Rejoindre l'ESH" : "Join ESH"}</p>
          <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? "Admissions" : "Admissions"}</h1>
          <p className="text-white/70 mt-2">
            {s.admissionsOpen === "true"
              ? (lang === "fr" ? `Inscriptions ${s.currentAcademicYear || "2025–2026"} ouvertes. Places limitées.` : `${s.currentAcademicYear || "2025–2026"} admissions open. Limited spots.`)
              : (lang === "fr" ? "Les inscriptions sont actuellement fermées." : "Admissions are currently closed.")}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Steps */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-[hsl(var(--primary))] mb-8">{lang === "fr" ? "Processus d'Inscription" : "Enrollment Process"}</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[hsl(209,50%,85%)] hidden md:block" />
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 z-10">
                    {i + 1}
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1">
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Two col: docs + fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Required docs */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-serif text-xl font-bold text-[hsl(var(--primary))] mb-5">{lang === "fr" ? "Documents Requis" : "Required Documents"}</h2>
            <ul className="space-y-3">
              {docs.map((doc, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fees table */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-serif text-xl font-bold text-[hsl(var(--primary))] mb-5">{lang === "fr" ? "Frais de Scolarité" : "School Fees"}</h2>
            <div className="space-y-3">
              {[
                [lang === "fr" ? "Frais d'inscription" : "Registration fee", "15,000 RWF"],
                [lang === "fr" ? "Maternelle (par trimestre)" : "Nursery (per term)", "45,000 RWF"],
                [lang === "fr" ? "Primaire (par trimestre)" : "Primary (per term)", "55,000 RWF"],
                [lang === "fr" ? "Frais de cantine" : "Canteen fees", "8,000 RWF / mois"],
                [lang === "fr" ? "Activités périscolaires" : "After-school activities", "5,000 RWF / mois"],
              ].map(([label, fee]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-900">{fee}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">{lang === "fr" ? "* Les frais peuvent varier. Contactez le secrétariat pour les tarifs exacts." : "* Fees may vary. Contact the office for exact rates."}</p>
          </div>
        </div>

        {/* Download + Contact CTA */}
        <div className="bg-[hsl(var(--primary))] rounded-2xl p-8 text-white text-center">
          <h2 className="font-serif text-2xl font-bold mb-3">{lang === "fr" ? "Prêt à postuler?" : "Ready to apply?"}</h2>
          <p className="text-white/70 mb-6">{lang === "fr" ? "Téléchargez le dossier ou contactez-nous directement." : "Download the form or contact us directly."}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/resources" className="flex items-center gap-2 px-6 py-3 bg-[hsl(49,87%,60%)] text-[hsl(209,64%,22%)] font-bold rounded-xl hover:opacity-90" data-testid="btn-download-form">
              <Download className="w-4 h-4" /> {lang === "fr" ? "Télécharger le dossier" : "Download form"}
            </Link>
            <Link href="/contact" className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10" data-testid="btn-contact-admissions">
              <Mail className="w-4 h-4" /> {lang === "fr" ? "Nous contacter" : "Contact us"}
            </Link>
          </div>
          {s.emailAdmissions && <p className="text-white/60 text-sm mt-4">{s.emailAdmissions} · {s.phone1}</p>}
        </div>
      </div>
    </PublicLayout>
  );
}
