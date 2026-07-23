import React from "react";

export function Input({
  label,
  error,
  icon: Icon,
  className = "",
  id,
  type = "text",
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium text-body">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-5 text-faint pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full bg-sunken border border-hairline text-ink placeholder:text-faint text-[15px] rounded-full py-3 transition-colors focus:outline-none focus:border-accent ${
            Icon ? "pl-12 pr-5" : "px-5"
          } ${error ? "border-red-500 focus:border-red-500" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[13px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}
