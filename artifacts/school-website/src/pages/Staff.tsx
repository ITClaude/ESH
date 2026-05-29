import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { useLang } from "@/contexts/LanguageContext";
import { useGetStaff, getGetStaffQueryKey } from "@workspace/api-client-react";

export default function StaffPage() {
  const { lang, t } = useLang();
  const { data, isLoading } = useGetStaff({}, { query: { queryKey: getGetStaffQueryKey({}) } });
  const staff = (data as any[]) || [];

  const DEPTS = [...new Set(staff.map((s: any) => s.department))];

  return (
    <PublicLayout>
      <div className="bg-[hsl(var(--primary))] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl font-bold">{lang === "fr" ? "Notre Personnel" : "Our Staff"}</h1>
          <p className="text-white/70 mt-2">{lang === "fr" ? "Une équipe dédiée à l'excellence éducative" : "A team dedicated to educational excellence"}</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-64" />)}</div>
        ) : (
          <div className="space-y-12">
            {DEPTS.map(dept => (
              <div key={dept}>
                <h2 className="font-serif text-xl font-bold text-[hsl(var(--primary))] capitalize mb-6">{dept}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {staff.filter((s: any) => s.department === dept).map((member: any, idx: number) => (
                    <motion.div key={member.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.07 }}>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow" data-testid={`staff-card-${member.id}`}>
                        <div className="h-44 bg-gray-100 overflow-hidden">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[hsl(209,50%,96%)]">
                              <div className="text-4xl font-serif font-bold text-[hsl(var(--primary))]/20">{member.fullName[0]}</div>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="font-semibold text-gray-900 text-sm">{member.fullName}</div>
                          <div className="text-xs text-[hsl(var(--primary))] mt-0.5">{t(member.roleFr, member.roleEn)}</div>
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="flex items-center gap-1 text-xs text-gray-400 mt-2 hover:text-[hsl(var(--primary))] transition-colors">
                              <Mail className="w-3 h-3" /> <span className="truncate">{member.email}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
