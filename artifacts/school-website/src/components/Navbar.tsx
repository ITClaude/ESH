import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, GraduationCap } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { useLang } from "@/contexts/LanguageContext";

const NAV = {
  fr: {
    about: "À Propos",
    mission: "Mission & Vision",
    history: "Notre Histoire",
    staff: "Notre Personnel",
    academic: "Académique",
    nursery: "Section Maternelle",
    primary: "Section Primaire",
    curriculum: "Programmes",
    timetable: "Emplois du Temps",
    news: "Actualités",
    events: "Événements",
    gallery: "Galerie",
    admissions: "Admissions",
    resources: "Ressources",
    contact: "Contact",
  },
  en: {
    about: "About",
    mission: "Mission & Vision",
    history: "Our History",
    staff: "Our Staff",
    academic: "Academic",
    nursery: "Nursery Section",
    primary: "Primary Section",
    curriculum: "Curriculum",
    timetable: "Timetables",
    news: "News",
    events: "Events",
    gallery: "Gallery",
    admissions: "Admissions",
    resources: "Resources",
    contact: "Contact",
  },
};

interface DropdownItem { label: string; href: string; }
interface NavItem { label: string; href?: string; dropdown?: DropdownItem[]; }

export function Navbar() {
  const { lang } = useLang();
  const n = NAV[lang];
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setActiveDropdown(null); }, [location]);

  const navItems: NavItem[] = [
    {
      label: n.about,
      dropdown: [
        { label: n.mission, href: "/about/mission" },
        { label: n.history, href: "/about/history" },
        { label: n.staff, href: "/about/staff" },
      ],
    },
    {
      label: n.academic,
      dropdown: [
        { label: n.nursery, href: "/academics/nursery" },
        { label: n.primary, href: "/academics/primary" },
        { label: n.curriculum, href: "/academics/curriculum" },
        { label: n.timetable, href: "/academics/timetable" },
      ],
    },
    { label: n.news, href: "/news" },
    { label: n.events, href: "/events" },
    { label: n.gallery, href: "/gallery" },
    { label: n.admissions, href: "/admissions" },
    { label: n.resources, href: "/resources" },
    { label: n.contact, href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[hsl(209,64%,28%)] shadow-lg py-2"
          : "bg-[hsl(209,64%,28%)] py-4"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" data-testid="navbar-logo">
          <div className="w-10 h-10 rounded-full bg-[hsl(49,87%,60%)] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-[hsl(209,64%,28%)]" />
          </div>
          <div className="text-white">
            <div className="font-serif font-bold text-base leading-tight">Ecole Saint Hannibal</div>
            <div className="text-xs text-[hsl(49,87%,80%)] leading-tight hidden sm:block">Kigali, Rwanda</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.dropdown ? (
                <div
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors"
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[hsl(209,50%,96%)] hover:text-[hsl(209,64%,28%)] transition-colors"
                          data-testid={`nav-sub-${sub.href}`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    location === item.href
                      ? "text-[hsl(49,87%,60%)] bg-white/10 font-medium"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right: Language + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <LanguageToggle className="hidden sm:flex" />
          <button
            className="xl:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-[hsl(209,64%,22%)] border-t border-white/10 max-h-screen overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            <div className="pb-3 mb-3 border-b border-white/10">
              <LanguageToggle />
            </div>
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white/90 hover:bg-white/10 rounded"
                      data-testid={`mobile-nav-${item.label}`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.dropdown.map((sub) => (
                          <Link key={sub.href} href={sub.href} className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded" data-testid={`mobile-nav-sub-${sub.href}`}>
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href!} className="block px-3 py-2.5 text-sm text-white/90 hover:bg-white/10 rounded" data-testid={`mobile-nav-${item.label}`}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-white/10">
              <Link href="/admissions" className="block w-full text-center px-4 py-2.5 bg-[hsl(49,87%,60%)] text-[hsl(209,64%,22%)] font-semibold rounded text-sm">
                {lang === "fr" ? "S'inscrire" : "Apply Now"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
