"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface BrandLogoProps {
  className?: string;
  withText?: boolean;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2 text-slate-900 font-bold", className)}>
      <Link href="/" className="text-brand-turquoise hover:opacity-80 transition-opacity">
        NavajaGT
      </Link>
      <span className="text-gray-500 font-light">✕</span>
      <a href="https://tripleaestudio.gua.gt" target="_blank" rel="noopener noreferrer" className="hover:text-brand-magenta transition-colors">
        AAA Estudio
      </a>
    </div>
  );
}
