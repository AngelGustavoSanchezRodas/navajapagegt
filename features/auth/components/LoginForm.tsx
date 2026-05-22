"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/modules/auth/services/auth.service";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "true") {
        const timer = setTimeout(() => {
          toast.error("Sesión caducada por seguridad");
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      if (data?.token) {
        login(data.token, data.user);
      }
      toast.success("¡Bienvenido de nuevo!");
      
      setIsRedirecting(true);
      
      // Pequeño retardo para UX antes de redirigir
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo iniciar sesión";
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoading || isRedirecting}
            required
            className="w-full rounded-xl border border-slate-200/80 bg-white/50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/40 disabled:opacity-50 text-base"
            placeholder="tu@correo.com"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading || isRedirecting}
            required
            className="w-full rounded-xl border border-slate-200/80 bg-white/50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/40 disabled:opacity-50 text-base"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || isRedirecting}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-turquoise px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {(isLoading || isRedirecting) && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRedirecting ? "Redirigiendo..." : isLoading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </GlassCard>
  );
}
