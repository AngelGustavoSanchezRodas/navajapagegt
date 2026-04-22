import { Library, QrCode, Users } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/GlassCard";

const features = [
  {
    title: "Colaboración de equipos",
    description:
      "Comparte enlaces con tu equipo y centraliza la gestión en un solo espacio.",
    icon: Users,
    badgeClassName: "bg-brand-magenta/15 text-brand-magenta",
  },
  {
    title: "QR inmediato",
    description:
      "Genera códigos QR listos para descargar y usar en campañas o eventos.",
    icon: QrCode,
    badgeClassName: "bg-brand-mustard/20 text-brand-dark",
  },
  {
    title: "Biblioteca inteligente",
    description:
      "Organiza enlaces por categorías para encontrarlos rápido cuando los necesites.",
    icon: Library,
    badgeClassName: "bg-brand-magenta/15 text-brand-magenta",
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {features.map(({ title, description, icon: Icon, badgeClassName }) => (
        <GlassCard key={title} className="p-6 sm:p-6 text-left">
          <Icon className="h-6 w-6 text-brand-turquoise" />
          <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
          <span
            className={`mt-5 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClassName}`}
          >
            Próximamente
          </span>
        </GlassCard>
      ))}
    </div>
  );
}
