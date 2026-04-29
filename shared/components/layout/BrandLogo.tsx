"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface BrandLogoProps {
  className?: string;
  withText?: boolean;
}

export function BrandLogo({ className, withText = true }: BrandLogoProps) {
  return (
    <Link 
      href="/" 
      className={cn("flex items-center gap-2 transition-opacity hover:opacity-80", className)}
    >
      <div className="relative h-8 w-10 flex-shrink-0">
        {/* Monograma NavajaGT - Construcción Geométrica Exacta */}
        <svg 
          viewBox="0 0 140 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-sm"
        >
          {/* N principal (Turquesa) */}
          <path 
            d="M 5 5 L 15 5 L 90 105 L 90 115 L 52.5 115 L 15 65 L 5 65 Z" 
            fill="#00BFAE"
          />
          {/* T secundaria (Turquesa) */}
          <path 
            d="M 65 45 L 125 45 L 125 65 L 115 65 L 115 115 L 95 115 L 95 65 L 65 65 Z" 
            fill="#00BFAE"
          />
          {/* Paralelogramo superior (Magenta) */}
          <path 
            d="M 65 15 L 115 15 L 130 35 L 80 35 Z" 
            fill="#E91E63"
          />
          {/* Paralelogramo inferior (Mostaza) */}
          <path 
            d="M 30 105 L 40 105 L 47.5 115 L 37.5 115 Z" 
            fill="#FFC107"
          />
        </svg>
      </div>
      
      {withText && (
        <span className="font-black text-xl tracking-tight" style={{ color: '#1E298B' }}>
          NavajaGT
        </span>
      )}
    </Link>
  );
}
