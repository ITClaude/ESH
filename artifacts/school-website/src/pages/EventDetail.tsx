import { Link } from "wouter";
import { ArrowLeft, Calendar, MapPin, Clock, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetEvent, getGetEventQueryKey } from "@workspace/api-client-react";

export default function EventDetail({ params }: { params: { id: string } }) {
  const { lang, t } = useLang();
  const { data: event, isLoading } = useGetEvent(params.id, { query: { queryKey: getGetEventQueryKey(params.id) } });
  const ev = event as any;

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" /> {lang === "fr" ? "Retour aux événements" : "Back to events"}
          </Link>
          {isLoading ? <div className="h-8 bg-white/20 rounded w-2/3 animate-pulse" /> : (
            <h1 className="font-serif text-3xl md:text-4xl font-bold">{t(ev?.titleFr, ev?.titleEn)}</h1>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}</div>
        ) : !ev ? (
          <div className="text-center py-20 text-gray-400">{lang === "fr" ? "Événement introuvable" : "Event not found"}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {ev.featuredImage && <img src={ev.featuredImage} alt={ev.titleFr} className="w-full h-64 object-cover rounded-2xl mb-6" loading="lazy" />}
              {(ev.descriptionFr || ev.descriptionEn) && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">{t(ev.descriptionFr, ev.descriptionEn)}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {[
                { icon: Calendar, label: lang === "fr" ? "Date" : "Date", value: new Date(ev.startDatetime).toLocaleDateString("fr-RW", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                { icon: Clock, label: lang === "fr" ? "Heure" : "Time", value: new Date(ev.startDatetime).toLocaleTimeString("fr-RW", { hour: "2-digit", minute: "2-digit" }) + (ev.endDatetime ? ` → ${new Date(ev.endDatetime).toLocaleTimeString("fr-RW", { hour: "2-digit", minute: "2-digit" })}` : "") },
                { icon: MapPin, label: lang === "fr" ? "Lieu" : "Location", value: t(ev.locationFr, ev.locationEn) },
                { icon: Users, label: "Public", value: (ev.audience || []).join(", ") || "Tous" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3 bg-[hsl(209,50%,96%)] rounded-xl p-4">
                  <Icon className="w-5 h-5 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
                    <div className="text-gray-800 text-sm mt-0.5 capitalize">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
