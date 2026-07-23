import React from "react";

export function Badge({ children, variant = "accent", className = "" }) {
  const variants = {
    accent: "bg-accent-soft text-accent border-transparent",
    neutral: "bg-sunken text-body border-hairline",
    // Backward-compatible aliases
    blue: "bg-accent-soft text-accent border-transparent",
    slate: "bg-sunken text-body border-hairline",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium border ${variants[variant] || variants.accent} ${className}`}
    >
      {children}
    </span>
  );
}
