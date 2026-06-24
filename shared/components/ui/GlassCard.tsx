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
      className={cn("glass-panel rounded-3xl p-4 sm:p-5 md:p-6", className)}
      {...props}
    />
  );
};

GlassCard.displayName = "GlassCard";
