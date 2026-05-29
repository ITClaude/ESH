import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, ArrowRight, Download, Phone, Mail, ExternalLink } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import {
  useGetSlides, getGetSlidesQueryKey,
  useGetRecentNews, getGetRecentNewsQueryKey,
  useGetHomepageEvents, getGetHomepageEventsQueryKey,
  useGetGalleryPreview, getGetGalleryPreviewQueryKey,
  useGetSettingsMap, getGetSettingsMapQueryKey,
} from "@workspace/api-client-react";

const TESTIMONIALS = [
  { name: "Mme Claudette Uwase", role: "Mère de Cécile (P4-A)", text: "L'Ecole Saint Hannibal a transformé ma fille. Elle est devenue plus confiante, plus curieuse, et elle adore apprendre." },
  { name: "M. Théophile Habumuremyi", role: "Père de Joseph (N3-B)", text: "Les enseignants sont dévoués et attentionnés. Mon fils parle maintenant couramment en français et en anglais. Je recommande vivement." },
  { name: "Dr. Anastase Niyonzima", role: "Parent d'élève", text: "En 17 ans d'existence, cette école a prouvé son excellence. Le corps enseignant est exceptionnel et les résultats parlent d'eux-mêmes." },
  { name: "Mme Vestine Mukandori", role: "Mère de jumeaux (P2)", text: "Mes deux garçons s'épanouissent ici. Le mélange de rigueur académique et d'activités culturelles est parfait." },
  { name: "M. Alexis Bizimana", role: "Ancien élève (promotion 2022)", text: "ESH m'a donné les bases solides pour réussir au lycée. Je suis reconnaissant pour chaque enseignant qui a cru en moi." },
];

function useCounter(target: number, isVisible: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, isVisible]);
  return count;
}

function StatBar({ settings }: { settings: Record<string, string> }) {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const students = useCounter(parseInt(settings.totalStudentsDisplay ?? "290"), visible);
  const classes = useCounter(27, visible);
  const years = useCounter(17, visible);
  const teachers = useCounter(32, visible);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { value: students, label: lang === "fr" ? "Élèves" : "Students" },
    { value: classes, label: lang === "fr" ? "Classes" : "Classes" },
    { value: years, label: lang === "fr" ? "Ans d'excellence" : "Years of excellence" },
    { value: teachers, label: lang === "fr" ? "Enseignants" : "Teachers" },
  ];

  return (
    <div className="bg-[hsl(var(--primary))] text-white py-10">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl md:text-4xl font-bold font-serif text-[hsl(49,87%,60%)]">{s.value}+</div>
            <div className="text-sm text-white/80 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSlider({ slides }: { slides: any[] }) {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-[hsl(209,64%,28%)] to-[hsl(209,64%,18%)] flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">Ecole Saint Hannibal</h1>
          <p className="text-xl text-white/80 mb-8">Excellence, Intégrité, Compassion</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/about" className="px-6 py-3 bg-[hsl(49,87%,60%)] text-[hsl(209,64%,22%)] font-bold rounded-lg hover:opacity-90 transition-opacity">Découvrir l'école</Link>
            <Link href="/admissions" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">S'inscrire</Link>
          </div>
        </div>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div
      className="relative h-[70vh] min-h-[500px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-testid="hero-slider"
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.imageUrl} alt={s.headingFr} className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              {t(slide.headingFr, slide.headingEn)}
            </h1>
            {(slide.subtextFr || slide.subtextEn) && (
              <p className="text-lg text-white/85 mb-8 leading-relaxed">
                {t(slide.subtextFr, slide.subtextEn)}
              </p>
            )}
            <div className="flex gap-4 flex-wrap">
              {slide.cta1Text && (
                <Link href={slide.cta1Url || "#"} className="px-6 py-3 bg-[hsl(49,87%,60%)] text-[hsl(209,64%,22%)] font-bold rounded-lg hover:opacity-90 transition-opacity text-sm" data-testid="hero-cta1">
                  {slide.cta1Text}
                </Link>
              )}
              {slide.cta2Text && (
                <Link href={slide.cta2Url || "#"} className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm" data-testid="hero-cta2">
                  {slide.cta2Text}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors" data-testid="hero-prev"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors" data-testid="hero-next"><ChevronRight className="w-5 h-5" /></button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-[hsl(49,87%,60%)] w-6" : "bg-white/50"}`} data-testid={`hero-dot-${i}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const { lang, t } = useLang();
  const { data: slides } = useGetSlides({ query: { queryKey: getGetSlidesQueryKey() } });
  const { data: recentNews } = useGetRecentNews({ query: { queryKey: getGetRecentNewsQueryKey() } });
  const { data: events } = useGetHomepageEvents({ query: { queryKey: getGetHomepageEventsQueryKey() } });
  const { data: galleryPreview } = useGetGalleryPreview({ query: { queryKey: getGetGalleryPreviewQueryKey() } });
  const { data: settings } = useGetSettingsMap({ query: { queryKey: getGetSettingsMapQueryKey() } });
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const slideList = (slides as any[]) || [];
  const newsList = (recentNews as any[]) || [];
  const eventList = (events as any[]) || [];
  const galleryList = (galleryPreview as any[]) || [];
  const s: Record<string, string> = (settings as any) || {};

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const EVENT_TYPES: Record<string, string> = { academic: "Académique", sports: "Sport", cultural: "Culture", holiday: "Vacances", meeting: "Réunion", trip: "Sortie", other: "Autre" };

  return (
    <PublicLayout>
      {/* Hero */}
      <HeroSlider slides={slideList} />

      {/* Stats */}
      <StatBar settings={s} />

      {/* Director Message */}
      {s.directorMessageFr && (
        <section className="section-py bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="relative">
                  <div className="w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[hsl(209,50%,96%)] to-[hsl(209,64%,85%)] flex items-center justify-center">
                    <div className="text-[hsl(var(--primary))] text-7xl font-serif font-bold opacity-20">ESH</div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-[hsl(49,87%,60%)] flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[hsl(209,64%,22%)]">2008</div>
                      <div className="text-xs text-[hsl(209,64%,22%)]">fondée</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                <p className="text-sm font-semibold text-[hsl(49,87%,50%)] uppercase tracking-widest mb-3">{lang === "fr" ? "Message de la Direction" : "Message from Management"}</p>
                <h2 className="font-serif text-3xl font-bold text-[hsl(var(--primary))] mb-6 heading-underline">
                  {t(s.directorNameFr, s.directorNameFr)}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4 italic text-lg">
                  "{t(s.directorMessageFr, s.directorMessageEn)}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{t(s.directorNameFr, s.directorNameFr)}</div>
                  <div className="text-sm text-[hsl(var(--primary))]">{t(s.directorTitleFr, s.directorTitleEn || "General Director")}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="section-py bg-[hsl(210,20%,98%)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-[hsl(49,87%,50%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Actualités" : "News"}</p>
              <h2 className="font-serif text-3xl font-bold text-[hsl(var(--primary))] heading-underline">{lang === "fr" ? "Dernières Nouvelles" : "Latest News"}</h2>
            </div>
            <Link href="/news" className="flex items-center gap-2 text-sm text-[hsl(var(--primary))] font-medium hover:gap-3 transition-all" data-testid="link-all-news">
              {lang === "fr" ? "Toutes les actualités" : "All news"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsList.length === 0 ? [1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded" /></div>
              </div>
            )) : newsList.map((article: any, idx: number) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <Link href={`/news/${article.slug}`} className="group block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow" data-testid={`news-card-${article.id}`}>
                  <div className="h-48 overflow-hidden">
                    <img src={article.featuredImage || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"} alt={article.titleFr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <div className="p-5">
                    {article.category && <span className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-wide">{article.category}</span>}
                    <h3 className="font-serif text-base font-bold text-gray-900 mt-1 mb-2 group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">{t(article.titleFr, article.titleEn)}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{t(article.excerptFr, article.excerptEn)}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-400">{article.author}</span>
                      <span className="text-xs text-gray-400">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("fr-RW", { day: "numeric", month: "short" }) : ""}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-py bg-[hsl(var(--primary))]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-[hsl(49,87%,60%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Agenda" : "Calendar"}</p>
              <h2 className="font-serif text-3xl font-bold text-white">{lang === "fr" ? "Prochains Événements" : "Upcoming Events"}</h2>
            </div>
            <Link href="/events" className="flex items-center gap-2 text-sm text-white/80 hover:text-white font-medium" data-testid="link-all-events">
              {lang === "fr" ? "Voir tous" : "See all"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventList.length === 0 ? (
              <p className="text-white/60 col-span-3 text-center py-8">{lang === "fr" ? "Aucun événement à venir" : "No upcoming events"}</p>
            ) : eventList.map((ev: any, idx: number) => (
              <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Link href={`/events/${ev.id}`} className="block bg-white/10 backdrop-blur rounded-xl p-5 hover:bg-white/20 transition-colors border border-white/10" data-testid={`event-card-${ev.id}`}>
                  <div className="flex items-start gap-4">
                    <div className="bg-[hsl(49,87%,60%)] text-[hsl(209,64%,22%)] rounded-lg px-3 py-2 text-center flex-shrink-0">
                      <div className="text-xl font-bold leading-none">{new Date(ev.startDatetime).getDate()}</div>
                      <div className="text-xs font-medium">{new Date(ev.startDatetime).toLocaleDateString("fr-RW", { month: "short" }).toUpperCase()}</div>
                    </div>
                    <div>
                      <span className="text-xs text-white/60 uppercase tracking-wide">{EVENT_TYPES[ev.eventType] || ev.eventType}</span>
                      <h3 className="text-white font-semibold text-sm mt-0.5 line-clamp-2">{t(ev.titleFr, ev.titleEn)}</h3>
                      <div className="flex items-center gap-1 text-white/60 text-xs mt-2">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{t(ev.locationFr, ev.locationEn)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Divisions */}
      <section className="section-py bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(49,87%,50%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Nos Sections" : "Our Sections"}</p>
            <h2 className="font-serif text-3xl font-bold text-[hsl(var(--primary))]">{lang === "fr" ? "Programme Académique" : "Academic Programme"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { href: "/academics/nursery", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", titleFr: "Section Maternelle", titleEn: "Nursery Section", descFr: "M1 à M3 — 9 classes bilingues pour les tout-petits de 2 à 5 ans. Éveil, jeu, et apprentissage au cœur du programme.", descEn: "N1 to N3 — 9 bilingual classes for toddlers aged 2-5. Discovery, play, and learning at the heart of the program.", badge: "N1 → N3" },
              { href: "/academics/primary", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", titleFr: "Section Primaire", titleEn: "Primary Section", descFr: "P1 à P6 — 12 classes bilingues. Programme rigoureux couvrant les sciences, les mathématiques, les langues et les arts.", descEn: "P1 to P6 — 12 bilingual classes. Rigorous program covering sciences, maths, languages and arts.", badge: "P1 → P6" },
            ].map((div, i) => (
              <motion.div key={div.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <Link href={div.href} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow" data-testid={`division-card-${div.badge}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img src={div.img} alt={div.titleFr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(209,64%,15%)]/80 to-transparent" />
                    <div className="absolute top-4 right-4 bg-[hsl(49,87%,60%)] text-[hsl(209,64%,22%)] font-bold text-sm px-3 py-1 rounded-full">{div.badge}</div>
                  </div>
                  <div className="bg-white p-6">
                    <h3 className="font-serif text-xl font-bold text-[hsl(var(--primary))] mb-2 group-hover:text-[hsl(209,64%,22%)] transition-colors">{t(div.titleFr, div.titleEn)}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{t(div.descFr, div.descEn)}</p>
                    <div className="flex items-center gap-2 text-[hsl(var(--primary))] text-sm font-medium mt-4 group-hover:gap-3 transition-all">
                      {lang === "fr" ? "Découvrir" : "Learn more"} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      {galleryList.length > 0 && (
        <section className="section-py bg-[hsl(210,20%,98%)]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold text-[hsl(49,87%,50%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Galerie" : "Gallery"}</p>
                <h2 className="font-serif text-3xl font-bold text-[hsl(var(--primary))] heading-underline">{lang === "fr" ? "La Vie à l'ESH" : "Life at ESH"}</h2>
              </div>
              <Link href="/gallery" className="flex items-center gap-2 text-sm text-[hsl(var(--primary))] font-medium" data-testid="link-gallery">
                {lang === "fr" ? "Voir la galerie" : "View gallery"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryList.slice(0, 6).map((item: any) => (
                <Link key={item.id} href="/gallery" className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer" data-testid={`gallery-teaser-${item.id}`}>
                  <img src={item.mediaUrl} alt={item.captionFr || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section-py bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-[hsl(49,87%,50%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Témoignages" : "Testimonials"}</p>
          <h2 className="font-serif text-3xl font-bold text-[hsl(var(--primary))] mb-12">{lang === "fr" ? "Ce Que Disent Nos Familles" : "What Our Families Say"}</h2>
          <div className="relative min-h-[200px]">
            <motion.div key={testimonialIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl mx-auto" data-testid="testimonial">
              <div className="text-5xl text-[hsl(49,87%,60%)] font-serif mb-4">"</div>
              <p className="text-lg text-gray-700 leading-relaxed italic mb-6">{TESTIMONIALS[testimonialIdx].text}</p>
              <div className="font-semibold text-gray-900">{TESTIMONIALS[testimonialIdx].name}</div>
              <div className="text-sm text-[hsl(var(--primary))]">{TESTIMONIALS[testimonialIdx].role}</div>
            </motion.div>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === testimonialIdx ? "bg-[hsl(var(--primary))] w-6" : "bg-gray-300"}`} data-testid={`testimonial-dot-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="py-16 bg-[hsl(49,87%,60%)]" data-testid="admissions-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[hsl(209,64%,22%)] mb-4">
            {lang === "fr" ? `Inscriptions ${s.currentAcademicYear || "2025–2026"} Maintenant Ouvertes` : `${s.currentAcademicYear || "2025–2026"} Admissions Now Open`}
          </h2>
          <p className="text-[hsl(209,64%,28%)] text-lg mb-8">
            {lang === "fr" ? "Rejoignez la famille ESH. Places limitées — inscrivez-vous dès aujourd'hui." : "Join the ESH family. Limited spots — register today."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/admissions" className="px-8 py-3.5 bg-[hsl(var(--primary))] text-white font-bold rounded-xl hover:opacity-90 transition-opacity" data-testid="cta-apply">
              {lang === "fr" ? "Faire une demande" : "Apply Now"}
            </Link>
            <Link href="/resources" className="flex items-center gap-2 px-8 py-3.5 border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] font-bold rounded-xl hover:bg-[hsl(var(--primary))]/10 transition-colors" data-testid="cta-prospectus">
              <Download className="w-4 h-4" />
              {lang === "fr" ? "Télécharger le Prospectus" : "Download Prospectus"}
            </Link>
          </div>
        </div>
      </section>

      {/* Contact/Map */}
      <section className="section-py bg-[hsl(210,20%,98%)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-[hsl(var(--primary))]">{lang === "fr" ? "Nous Trouver" : "Find Us"}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {s.mapsEmbedUrl && (
              <div className="rounded-2xl overflow-hidden shadow-lg h-72 lg:h-96">
                <iframe src={s.mapsEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ecole Saint Hannibal" />
              </div>
            )}
            <div className="bg-white rounded-2xl p-8 shadow-md space-y-5">
              <h3 className="font-serif text-xl font-bold text-gray-900">{lang === "fr" ? "Nos Coordonnées" : "Our Contact Details"}</h3>
              {[
                { icon: MapPin, label: lang === "fr" ? "Adresse" : "Address", value: t(s.addressFr, s.addressEn) || "KG 123 St, Kacyiru, Kigali" },
                { icon: Phone, label: lang === "fr" ? "Téléphone" : "Phone", value: s.phone1 || "+250 788 123 456" },
                { icon: Mail, label: lang === "fr" ? "Email" : "Email", value: s.emailGeneral || "info@ecolesainthannibal.rw" },
                { icon: Clock, label: lang === "fr" ? "Horaires" : "Hours", value: t(s.officeHoursFr, s.officeHoursEn) || "Lun–Ven: 7h00–17h00" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(209,50%,96%)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
                    <div className="text-gray-800 text-sm mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
              <Link href="/contact" className="block mt-6 w-full text-center py-3 bg-[hsl(var(--primary))] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity" data-testid="link-contact-page">
                {lang === "fr" ? "Envoyer un message" : "Send a message"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
