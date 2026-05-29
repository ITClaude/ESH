import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetAlbum, getGetAlbumQueryKey } from "@workspace/api-client-react";

export default function GalleryAlbumPage({ params }: { params: { id: string } }) {
  const { lang, t } = useLang();
  const { data: album, isLoading } = useGetAlbum(params.id, { query: { queryKey: getGetAlbumQueryKey(params.id) } });
  const [lightbox, setLightbox] = useState<number | null>(null);
  const data = album as any;
  const items = data?.items || [];

  function openLightbox(idx: number) { setLightbox(idx); }
  function closeLightbox() { setLightbox(null); }
  function prev() { setLightbox(i => (i! - 1 + items.length) % items.length); }
  function next() { setLightbox(i => (i! + 1) % items.length); }

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4" data-testid="link-back-gallery">
            <ArrowLeft className="w-4 h-4" /> {lang === "fr" ? "Retour à la galerie" : "Back to gallery"}
          </Link>
          {isLoading ? <div className="h-8 bg-white/20 rounded w-1/2 animate-pulse" /> : (
            <>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">{t(data?.nameFr, data?.nameEn)}</h1>
              <p className="text-white/70 mt-2">{items.length} photo{items.length !== 1 ? "s" : ""} · {data?.eventDate}</p>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {data?.descriptionFr && <p className="text-gray-600 mb-8">{t(data.descriptionFr, data.descriptionEn)}</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item: any, idx: number) => (
                <div key={item.id} className="group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer" onClick={() => openLightbox(idx)} data-testid={`photo-${item.id}`}>
                  <img src={item.mediaUrl} alt={item.captionFr || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" data-testid="lightbox">
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white" data-testid="lightbox-close"><X className="w-8 h-8" /></button>
          <button onClick={prev} className="absolute left-4 text-white/70 hover:text-white" data-testid="lightbox-prev"><ChevronLeft className="w-10 h-10" /></button>
          <button onClick={next} className="absolute right-4 text-white/70 hover:text-white" data-testid="lightbox-next"><ChevronRight className="w-10 h-10" /></button>
          <div className="max-w-5xl max-h-[85vh] px-16">
            <img src={items[lightbox]?.mediaUrl} alt={items[lightbox]?.captionFr || ""} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            {items[lightbox]?.captionFr && <p className="text-white/70 text-center mt-3 text-sm">{t(items[lightbox].captionFr, items[lightbox].captionEn)}</p>}
            <p className="text-white/40 text-center mt-1 text-xs">{lightbox + 1} / {items.length}</p>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
