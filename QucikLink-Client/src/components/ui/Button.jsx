import React from "react";
import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-colors rounded-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-accent-ink",
    secondary: "bg-sunken text-ink border border-hairline hover:border-muted",
    outline: "bg-transparent text-body hover:text-ink border border-hairline hover:border-muted",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent text-muted hover:text-ink",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-[13px] gap-1.5",
    md: "px-4 py-2 text-[14px] gap-2",
    lg: "px-5 py-2.5 text-[15px] gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
