import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useGetSettingsMap, getGetSettingsMapQueryKey } from "@workspace/api-client-react";
import { useLang } from "@/contexts/LanguageContext";
import { X } from "lucide-react";
import { useState } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  const { data: settings } = useGetSettingsMap({ query: { queryKey: getGetSettingsMapQueryKey() } });
  const s: Record<string, string> = (settings as any) || {};
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const showBanner = s.announcementActive === "true" && s.announcementBanner && !bannerDismissed;

  return (
    <div className="min-h-screen flex flex-col">
      {showBanner && (
        <div className="bg-[hsl(49,87%,60%)] text-[hsl(209,64%,22%)] text-sm font-medium px-4 py-2 flex items-center justify-center gap-4 z-[60] relative">
          <span className="text-center">{s.announcementBanner}</span>
          <button onClick={() => setBannerDismissed(true)} className="flex-shrink-0 hover:opacity-70" aria-label="Dismiss" data-testid="banner-dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
