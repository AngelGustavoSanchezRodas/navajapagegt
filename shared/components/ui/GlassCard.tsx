import { forwardRef, type HTMLAttributes } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={["glass-panel rounded-3xl p-6 sm:p-8", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";
