import { Link } from "wouter";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetNewsBySlug, getGetNewsBySlugQueryKey } from "@workspace/api-client-react";

export default function NewsDetail({ params }: { params: { slug: string } }) {
  const { lang, t } = useLang();
  const { data: article, isLoading, isError } = useGetNewsBySlug(params.slug, {
    query: { queryKey: getGetNewsBySlugQueryKey(params.slug) },
  });

  const a = article as any;

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4" data-testid="link-back-news">
            <ArrowLeft className="w-4 h-4" /> {lang === "fr" ? "Retour aux actualités" : "Back to news"}
          </Link>
          {isLoading ? <div className="h-8 bg-white/20 rounded w-1/2 animate-pulse" /> : (
            <>
              {a?.category && <span className="text-xs font-semibold text-[hsl(49,87%,60%)] uppercase tracking-wide">{a.category}</span>}
              <h1 className="font-serif text-3xl md:text-4xl font-bold mt-2">{t(a?.titleFr, a?.titleEn)}</h1>
              <div className="flex items-center gap-5 mt-4 text-white/60 text-sm">
                <div className="flex items-center gap-1.5"><User className="w-4 h-4" />{a?.author}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{a?.publishedAt ? new Date(a.publishedAt).toLocaleDateString("fr-RW", { day: "numeric", month: "long", year: "numeric" }) : ""}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">{[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}</div>
        ) : isError ? (
          <div className="text-center py-20 text-gray-400">{lang === "fr" ? "Article introuvable" : "Article not found"}</div>
        ) : (
          <>
            {a?.featuredImage && <img src={a.featuredImage} alt={a.titleFr} className="w-full h-72 object-cover rounded-2xl mb-8" loading="lazy" />}
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[hsl(var(--primary))] prose-a:text-[hsl(var(--primary))]"
              dangerouslySetInnerHTML={{ __html: t(a?.bodyFr, a?.bodyEn) || "" }}
            />
            {a?.tags && a.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-8 pt-8 border-t border-gray-100">
                <Tag className="w-4 h-4 text-gray-400" />
                {a.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
