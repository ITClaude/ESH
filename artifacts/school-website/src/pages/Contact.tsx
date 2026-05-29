import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetSettingsMap, getGetSettingsMapQueryKey, useSubmitContact } from "@workspace/api-client-react";

export default function ContactPage() {
  const { lang, t } = useLang();
  const { data: settings } = useGetSettingsMap({ query: { queryKey: getGetSettingsMapQueryKey() } });
  const s: Record<string, string> = (settings as any) || {};
  const [form, setForm] = useState({ senderName: "", senderEmail: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const submitMutation = useSubmitContact({ mutation: { onSuccess: () => { setSent(true); setForm({ senderName: "", senderEmail: "", subject: "", message: "" }); } } });

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-[hsl(49,87%,60%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Écrivez-nous" : "Write to us"}</p>
          <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? "Nous Contacter" : "Contact Us"}</h1>
          <p className="text-white/70 mt-2">{lang === "fr" ? "Notre équipe vous répondra dans les 24 heures." : "Our team will respond within 24 hours."}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info column */}
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: MapPin, label: lang === "fr" ? "Adresse" : "Address", value: t(s.addressFr, s.addressEn) || "KG 123 St, Kacyiru, Kigali, Rwanda", href: undefined },
              { icon: Phone, label: lang === "fr" ? "Téléphone" : "Phone", value: s.phone1 || "+250 788 123 456", href: `tel:${s.phone1}` },
              { icon: Mail, label: lang === "fr" ? "Email" : "Email", value: s.emailGeneral || "info@ecolesainthannibal.rw", href: `mailto:${s.emailGeneral}` },
              { icon: Clock, label: lang === "fr" ? "Horaires" : "Hours", value: t(s.officeHoursFr, s.officeHoursEn) || "Lun–Ven: 7h–17h", href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-[hsl(209,50%,96%)] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
                  {href ? <a href={href} className="text-gray-800 text-sm mt-0.5 hover:text-[hsl(var(--primary))] transition-colors">{value}</a> : <div className="text-gray-800 text-sm mt-0.5">{value}</div>}
                </div>
              </div>
            ))}
            {s.whatsappNumber && (
              <a href={`https://wa.me/${s.whatsappNumber.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors" data-testid="link-whatsapp">
                <FaWhatsapp className="w-5 h-5" />
                {lang === "fr" ? "Écrire sur WhatsApp" : "Chat on WhatsApp"}
              </a>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">{lang === "fr" ? "Envoyer un Message" : "Send a Message"}</h2>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12" data-testid="success-message">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{lang === "fr" ? "Message envoyé!" : "Message sent!"}</h3>
                  <p className="text-gray-500">{lang === "fr" ? "Nous vous répondrons dans les 24 heures." : "We will respond within 24 hours."}</p>
                  <button onClick={() => setSent(false)} className="mt-6 px-6 py-2.5 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90">{lang === "fr" ? "Envoyer un autre message" : "Send another message"}</button>
                </motion.div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate({ data: form }); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang === "fr" ? "Nom complet *" : "Full name *"}</label>
                      <input type="text" value={form.senderName} onChange={e => upd("senderName", e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent" placeholder={lang === "fr" ? "Votre nom" : "Your name"} data-testid="input-name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang === "fr" ? "Adresse email *" : "Email address *"}</label>
                      <input type="email" value={form.senderEmail} onChange={e => upd("senderEmail", e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent" placeholder="email@exemple.com" data-testid="input-email" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang === "fr" ? "Objet" : "Subject"}</label>
                    <input type="text" value={form.subject} onChange={e => upd("subject", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent" placeholder={lang === "fr" ? "Objet de votre message" : "Message subject"} data-testid="input-subject" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{lang === "fr" ? "Message *" : "Message *"}</label>
                    <textarea value={form.message} onChange={e => upd("message", e.target.value)} required rows={6} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent resize-none" placeholder={lang === "fr" ? "Votre message..." : "Your message..."} data-testid="input-message" />
                  </div>
                  <button type="submit" disabled={submitMutation.isPending} className="w-full py-3.5 bg-[hsl(var(--primary))] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2" data-testid="button-send">
                    {submitMutation.isPending ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (lang === "fr" ? "Envoyer le Message" : "Send Message")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        {s.mapsEmbedUrl && (
          <div className="mt-12 rounded-2xl overflow-hidden shadow-lg h-80">
            <iframe src={s.mapsEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ecole Saint Hannibal" />
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
