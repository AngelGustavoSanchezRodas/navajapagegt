"use client";

import { type HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

export const GlassCard = ({ className, ref, ...props }: GlassCardProps) => {
  return (
    <div
      ref={ref}
      className={cn("glass-panel rounded-3xl p-6 sm:p-8", className)}
      {...props}
    />
  );
};

GlassCard.displayName = "GlassCard";
