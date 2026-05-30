import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Image, X } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetAlbums, getGetAlbumsQueryKey, useGetAlbum, getGetAlbumQueryKey } from "@workspace/api-client-react";

export default function GalleryPage() {
  const { lang, t } = useLang();
  const { data, isLoading } = useGetAlbums({}, { query: { queryKey: getGetAlbumsQueryKey({}) } });
  const albums = (data as any[]) || [];

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-[hsl(49,87%,60%)] uppercase tracking-widest mb-2">{lang === "fr" ? "Médiathèque" : "Media Library"}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">{lang === "fr" ? "Galerie Photos" : "Photo Gallery"}</h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">{lang === "fr" ? "Les moments forts de la vie à l'ESH" : "Highlights of life at ESH"}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-56" />)}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{lang === "fr" ? "Aucun album disponible" : "No albums available"}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album: any, idx: number) => (
              <motion.div key={album.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                <Link href={`/gallery/${album.id}`} className="group block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white border border-gray-100" data-testid={`album-card-${album.id}`}>
                  <div className="relative h-52 overflow-hidden">
                    {album.coverImage ? (
                      <img src={album.coverImage} alt={album.nameFr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-[hsl(209,50%,96%)] flex items-center justify-center">
                        <Image className="w-12 h-12 text-[hsl(var(--primary))]/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {lang === "fr" ? "Voir l'album" : "View album"}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-serif text-base font-bold text-gray-900">{t(album.nameFr, album.nameEn)}</h2>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400 capitalize">{album.category}</span>
                      <span className="text-xs text-gray-400">{album.itemCount} photo{album.itemCount !== 1 ? "s" : ""}</span>
                    </div>
                    {(album.descriptionFr || album.descriptionEn) && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{t(album.descriptionFr, album.descriptionEn)}</p>
                    )}
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
