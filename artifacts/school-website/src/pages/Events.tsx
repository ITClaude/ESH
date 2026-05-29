import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetEvents, getGetEventsQueryKey } from "@workspace/api-client-react";

const EVENT_TYPES: Record<string, { fr: string; en: string; color: string }> = {
  academic: { fr: "Académique", en: "Academic", color: "bg-blue-100 text-blue-800" },
  sports: { fr: "Sport", en: "Sports", color: "bg-green-100 text-green-800" },
  cultural: { fr: "Culture", en: "Cultural", color: "bg-purple-100 text-purple-800" },
  holiday: { fr: "Vacances", en: "Holiday", color: "bg-orange-100 text-orange-800" },
  meeting: { fr: "Réunion", en: "Meeting", color: "bg-gray-100 text-gray-800" },
  trip: { fr: "Sortie", en: "Trip", color: "bg-teal-100 text-teal-800" },
  other: { fr: "Autre", en: "Other", color: "bg-yellow-100 text-yellow-800" },
};

export default function EventsPage() {
  const { lang, t } = useLang();
  const { data, isLoading } = useGetEvents({}, { query: { queryKey: getGetEventsQueryKey({}) } });
  const events = (data as any[]) || [];

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-[hsl(49,87%,60%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Agenda" : "Calendar"}</p>
          <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? "Événements" : "Events"}</h1>
          <p className="text-white/70 mt-2">{lang === "fr" ? "Tous les événements de l'Ecole Saint Hannibal" : "All Ecole Saint Hannibal events"}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="animate-pulse bg-white rounded-xl h-28 border border-gray-200" />)}</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{lang === "fr" ? "Aucun événement" : "No events"}</div>
        ) : (
          <div className="space-y-4">
            {events.map((ev: any, idx: number) => {
              const typeInfo = EVENT_TYPES[ev.eventType] || EVENT_TYPES.other;
              return (
                <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Link href={`/events/${ev.id}`} className="group flex items-start gap-5 bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow" data-testid={`event-card-${ev.id}`}>
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="bg-[hsl(var(--primary))] text-white rounded-xl px-2 py-2">
                        <div className="text-2xl font-bold font-serif leading-none">{new Date(ev.startDatetime).getDate()}</div>
                        <div className="text-xs mt-0.5 uppercase">{new Date(ev.startDatetime).toLocaleDateString("fr-RW", { month: "short" })}</div>
                        <div className="text-xs opacity-70">{new Date(ev.startDatetime).getFullYear()}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeInfo.color}`}>{lang === "fr" ? typeInfo.fr : typeInfo.en}</span>
                        {ev.status !== "upcoming" && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ev.status === "completed" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-700"}`}>{ev.status}</span>}
                      </div>
                      <h2 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[hsl(var(--primary))] transition-colors">{t(ev.titleFr, ev.titleEn)}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{t(ev.locationFr, ev.locationEn)}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(ev.startDatetime).toLocaleTimeString("fr-RW", { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
