import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetNewsList, getGetNewsListQueryKey } from "@workspace/api-client-react";

const CATEGORIES = [
  { value: "", labelFr: "Toutes", labelEn: "All" },
  { value: "actualites", labelFr: "Actualités", labelEn: "News" },
  { value: "evenements", labelFr: "Événements", labelEn: "Events" },
  { value: "sports", labelFr: "Sports", labelEn: "Sports" },
  { value: "recompenses", labelFr: "Récompenses", labelEn: "Awards" },
  { value: "infrastructure", labelFr: "Infrastructure", labelEn: "Infrastructure" },
];

export default function NewsPage() {
  const { lang, t } = useLang();
  const [category, setCategory] = useState("");
  const params = category ? { category } : {};
  const { data, isLoading } = useGetNewsList(params, { query: { queryKey: getGetNewsListQueryKey(params) } });
  const articles = (data as any[]) || [];

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-[hsl(var(--primary))] text-white py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-[hsl(49,87%,60%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Vie Scolaire" : "School Life"}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">{lang === "fr" ? "Actualités" : "News"}</h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">{lang === "fr" ? "Toutes les nouvelles de l'Ecole Saint Hannibal" : "All news from Ecole Saint Hannibal"}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category filter — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap mb-8 no-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ${category === c.value ? "bg-[hsl(var(--primary))] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"}`} data-testid={`filter-${c.value || "all"}`}>
              {lang === "fr" ? c.labelFr : c.labelEn}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="animate-pulse bg-white rounded-xl h-64 border border-gray-200" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{lang === "fr" ? "Aucun article trouvé" : "No articles found"}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any, idx: number) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Link href={`/news/${article.slug}`} className="group block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all" data-testid={`article-card-${article.id}`}>
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img src={article.featuredImage || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <div className="p-5">
                    {article.category && <span className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-wide">{article.category}</span>}
                    <h2 className="font-serif text-base font-bold text-gray-900 mt-1 mb-2 group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">{t(article.titleFr, article.titleEn)}</h2>
                    <p className="text-sm text-gray-500 line-clamp-3">{t(article.excerptFr, article.excerptEn)}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1"><User className="w-3 h-3" />{article.author}</div>
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("fr-RW", { day: "numeric", month: "short", year: "numeric" }) : ""}</div>
                    </div>
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
