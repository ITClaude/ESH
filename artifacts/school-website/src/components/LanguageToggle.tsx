import { useLang } from "@/contexts/LanguageContext";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-0 text-sm font-medium ${className}`} data-testid="language-toggle">
      <button
        onClick={() => setLang("fr")}
        data-testid="lang-fr"
        className={`px-2 py-1 rounded-l transition-colors ${
          lang === "fr"
            ? "bg-[hsl(var(--primary))] text-white"
            : "text-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))]"
        }`}
      >
        FR
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => setLang("en")}
        data-testid="lang-en"
        className={`px-2 py-1 rounded-r transition-colors ${
          lang === "en"
            ? "bg-[hsl(var(--primary))] text-white"
            : "text-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))]"
        }`}
      >
        EN
      </button>
    </div>
  );
}
