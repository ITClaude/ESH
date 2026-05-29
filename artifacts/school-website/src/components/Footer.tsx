import { Link } from "wouter";
import { GraduationCap, Phone, Mail, MapPin, Clock, Facebook, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLang } from "@/contexts/LanguageContext";
import { useGetSettingsMap, getGetSettingsMapQueryKey } from "@workspace/api-client-react";

export function Footer() {
  const { lang, t } = useLang();
  const { data: settings } = useGetSettingsMap({ query: { queryKey: getGetSettingsMapQueryKey() } });

  const s: Record<string, string> = (settings as any) || {};

  return (
    <footer className="bg-[hsl(209,64%,18%)] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: School identity */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[hsl(49,87%,60%)] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-[hsl(209,64%,28%)]" />
            </div>
            <div>
              <div className="font-serif font-bold text-base leading-tight">Ecole Saint Hannibal</div>
              <div className="text-xs text-white/50 leading-tight">Kigali, Rwanda</div>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            {t(
              s.taglineFr || "Excellence, Intégrité, Compassion",
              s.taglienEn || s.taglineEn || "Excellence, Integrity, Compassion"
            )}
          </p>
          <div className="flex gap-3">
            {s.facebookUrl && (
              <a href={s.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-[hsl(49,87%,60%)] hover:text-[hsl(209,64%,28%)] transition-colors" aria-label="Facebook" data-testid="footer-facebook">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {s.youtubeUrl && (
              <a href={s.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-[hsl(49,87%,60%)] hover:text-[hsl(209,64%,28%)] transition-colors" aria-label="YouTube" data-testid="footer-youtube">
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {s.whatsappNumber && (
              <a href={`https://wa.me/${s.whatsappNumber.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-[hsl(49,87%,60%)] hover:text-[hsl(209,64%,28%)] transition-colors" aria-label="WhatsApp" data-testid="footer-whatsapp">
                <FaWhatsapp className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Col 2: Quick links */}
        <div>
          <h4 className="font-serif font-semibold text-base mb-4 text-[hsl(49,87%,60%)]">
            {lang === "fr" ? "Liens Rapides" : "Quick Links"}
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              ["/about/mission", lang === "fr" ? "Mission & Vision" : "Mission & Vision"],
              ["/about/history", lang === "fr" ? "Notre Histoire" : "Our History"],
              ["/academics/nursery", lang === "fr" ? "Section Maternelle" : "Nursery"],
              ["/academics/primary", lang === "fr" ? "Section Primaire" : "Primary"],
              ["/admissions", lang === "fr" ? "Admissions" : "Admissions"],
              ["/contact", lang === "fr" ? "Nous Contacter" : "Contact Us"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-[hsl(49,87%,60%)] transition-colors" data-testid={`footer-link-${href}`}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Academic links */}
        <div>
          <h4 className="font-serif font-semibold text-base mb-4 text-[hsl(49,87%,60%)]">
            {lang === "fr" ? "Vie Scolaire" : "School Life"}
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              ["/news", lang === "fr" ? "Actualités" : "News"],
              ["/events", lang === "fr" ? "Événements" : "Events"],
              ["/gallery", lang === "fr" ? "Galerie Photos" : "Photo Gallery"],
              ["/resources", lang === "fr" ? "Ressources & Documents" : "Resources & Downloads"],
              ["/academics/curriculum", lang === "fr" ? "Programmes" : "Curriculum"],
              ["/academics/timetable", lang === "fr" ? "Emplois du Temps" : "Timetables"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-[hsl(49,87%,60%)] transition-colors" data-testid={`footer-link-${href}`}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="font-serif font-semibold text-base mb-4 text-[hsl(49,87%,60%)]">
            {lang === "fr" ? "Nous Trouver" : "Find Us"}
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2">
              <MapPin className="w-4 h-4 text-[hsl(49,87%,60%)] flex-shrink-0 mt-0.5" />
              <span>{t(s.addressFr, s.addressEn) || "KG 123 St, Kacyiru, Kigali"}</span>
            </li>
            {s.phone1 && (
              <li className="flex gap-2">
                <Phone className="w-4 h-4 text-[hsl(49,87%,60%)] flex-shrink-0 mt-0.5" />
                <span>{s.phone1}</span>
              </li>
            )}
            {s.emailGeneral && (
              <li className="flex gap-2">
                <Mail className="w-4 h-4 text-[hsl(49,87%,60%)] flex-shrink-0 mt-0.5" />
                <a href={`mailto:${s.emailGeneral}`} className="hover:text-white transition-colors">{s.emailGeneral}</a>
              </li>
            )}
            {s.officeHoursFr && (
              <li className="flex gap-2">
                <Clock className="w-4 h-4 text-[hsl(49,87%,60%)] flex-shrink-0 mt-0.5" />
                <span>{t(s.officeHoursFr, s.officeHoursEn)}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>&copy; {new Date().getFullYear()} Ecole Saint Hannibal. {lang === "fr" ? "Tous droits réservés." : "All rights reserved."}</span>
          <Link href="/admin/login" className="hover:text-white/70 transition-colors" data-testid="footer-admin-link">
            {lang === "fr" ? "Administration" : "Admin"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
