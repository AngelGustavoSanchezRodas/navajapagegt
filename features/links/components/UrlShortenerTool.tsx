"use client";

import { FormEvent, useState } from "react";
import { Link, Loader2, QrCode } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/GlassCard";

export function UrlShortenerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="shortener-url" className="text-sm text-slate-500">
          Pega tu enlace largo
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-14 flex-1 items-center rounded-2xl border border-slate-200/50 bg-white/50 px-4">
            <Link className="mr-3 h-5 w-5 text-slate-400" />
            <input
              id="shortener-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://tuenlace.com/..."
              className="h-full w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-turquoise px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4" />
                Acortar URL
              </>
            )}
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
