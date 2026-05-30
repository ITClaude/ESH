import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useGetSettingsMap, getGetSettingsMapQueryKey } from "@workspace/api-client-react";
import { useState } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { data: settings } = useGetSettingsMap({ query: { queryKey: getGetSettingsMapQueryKey() } });
  const s: Record<string, string> = (settings as any) || {};
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const showBanner = s.announcementActive === "true" && !!s.announcementBanner && !bannerDismissed;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        banner={showBanner ? s.announcementBanner : null}
        onDismissBanner={() => setBannerDismissed(true)}
        logoUrl={s.logoUrl || null}
      />
      {/*
        Padding-top offsets the fixed header.
        Banner (~40px) + nav (~56px) = ~96px → pt-24 (96px) on mobile where banner may wrap.
        On sm+ banner stays single line → pt-[6.5rem] (104px) is generous.
        No banner: pt-14 sm:pt-16 (nav only).
      */}
      <main className={`flex-1 ${showBanner ? "pt-24 sm:pt-[6.5rem]" : "pt-14 sm:pt-16"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
