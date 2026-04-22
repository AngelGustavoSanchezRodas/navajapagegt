import { CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { siteConfig, siteLinks } from "@/shared/config/site";

const FEATURES = [
  "Sin límites de tamaño",
  "Procesamiento por lotes",
  "Soporte prioritario",
  "Sin anuncios",
  "Firma digital ilimitada",
  "Almacenamiento en la nube"
];

export function ContactSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <GlassCard className="overflow-hidden bg-brand-turquoise/5 p-10 md:p-20 border-none rounded-[3rem]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">
              Descubre {siteConfig.name} <span className="text-brand-turquoise">Premium</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
              {FEATURES.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-turquoise" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href={siteLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-5 bg-brand-magenta hover:bg-brand-magenta/90 text-white text-center font-bold rounded-2xl shadow-xl shadow-brand-magenta/20 transition-all transform hover:-translate-y-1"
              >
                Actualizar a Premium
              </a>
              <a 
                href={siteLinks.mailto}
                className="w-full sm:w-auto px-10 py-5 bg-white text-brand-turquoise text-center font-bold rounded-2xl border border-brand-turquoise/20 hover:bg-slate-50 transition-all"
              >
                Contactar Soporte
              </a>
            </div>
          </div>

          <div className="relative z-10 text-right hidden lg:block">
            <div className="w-64 h-64 bg-brand-turquoise/20 rounded-full blur-3xl absolute -right-20 -top-20"></div>
            <div className="w-48 h-48 bg-brand-magenta/20 rounded-full blur-3xl absolute -left-10 -bottom-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              alt="Premium dashboard"
              className="w-96 rounded-3xl shadow-2xl relative z-10 rotate-3 grayscale opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
