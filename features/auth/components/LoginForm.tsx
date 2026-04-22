"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { authService } from "@/modules/auth/services/auth.service";
import { GlassCard } from "@/shared/components/ui/GlassCard";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await authService.login(email, password);
      toast.success("Inicio de sesión exitoso");
      window.location.href = "/dashboard";
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
            required
            className="w-full rounded-xl border border-slate-200/80 bg-white/50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/40"
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
            required
            className="w-full rounded-xl border border-slate-200/80 bg-white/50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/40"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-brand-turquoise px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </GlassCard>
  );
}
