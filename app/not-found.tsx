import Link from "next/link";
import { GlassCard } from "@/shared/components/ui/GlassCard";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
      <GlassCard className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-6xl font-black text-brand-turquoise">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Página no encontrada</h2>
          <p className="text-slate-500">
            Lo sentimos, el enlace que buscas no existe o ha sido movido.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-brand-turquoise px-8 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </GlassCard>
    </div>
  );
}
