import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (t) => {
      if (t === "dark") {
        root.classList.add("dark");
      } else if (t === "light") {
        root.classList.remove("dark");
      } else {
        // System preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    // Listen for system theme change if theme is 'system'
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const CurrentIcon =
    theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-muted hover:text-ink hover:border-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-36 bg-panel border border-hairline rounded-2xl py-1 z-50 text-[13px]">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTheme(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left font-medium transition-colors ${
                    isSelected
                      ? "text-accent"
                      : "text-body hover:text-ink"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
