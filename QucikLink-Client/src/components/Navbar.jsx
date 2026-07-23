import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuthToken, removeAuthToken } from "../services/api";
import { LogOut, Link2, Menu, X, User } from "lucide-react";
import { Button } from "./ui/Button";
import ThemeToggle from "./ThemeToggle";

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6z" />
  </svg>
);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = getAuthToken();

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleRecentClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById("recent-links");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("recent-links");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  const navItems = [
    { path: "/", label: "Shorten" },
    { path: "/#recent-links", label: "Recent Links", isAnchor: true },
    { path: "/lookup", label: "Analytics" },
  ];

  return (
    <nav className="text-ink">
      <div className="max-w-[1120px] mx-auto px-6 py-6 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="QuickLink home">
          <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-ink font-bold group-hover:brightness-105 transition">
            <Link2 className="w-4 h-4" strokeWidth={2.5} />
          </span>
          <span className="font-heading font-bold text-[19px] tracking-tight text-ink">
            QuickLink
          </span>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-6">
          {/* Nav links + Theme Toggle at the end */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              if (item.isAnchor) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={handleRecentClick}
                    className="text-[14px] font-medium text-muted hover:text-ink transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[14px] font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-ink font-semibold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Theme Toggle at the end of nav links */}
            <ThemeToggle />
          </div>

          {/* Social Profiles & Auth Actions */}
          <div className="flex items-center gap-3 border-l border-hairline pl-5">
            <a
              href="https://github.com/lakshmanbhukya"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-sunken border border-hairline text-muted hover:text-ink flex items-center justify-center transition-colors"
              title="GitHub - @lakshmanbhukya"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/lakshmanbhukya"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-sunken border border-hairline text-muted hover:text-ink flex items-center justify-center transition-colors"
              title="LinkedIn - @lakshmanbhukya"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            {token ? (
              <div className="flex items-center gap-3 ml-1">
                <div
                  className="w-9 h-9 rounded-full bg-sunken border border-hairline text-accent flex items-center justify-center"
                  title="Account active"
                >
                  <User className="w-4 h-4" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-1">
                <Link
                  to="/login"
                  className="text-[14px] font-medium text-muted hover:text-ink transition-colors px-1"
                >
                  Log in
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="px-5 py-2 text-[13px] font-semibold rounded-full shadow-sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Actions & Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-muted hover:text-ink transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-hairline px-6 py-4 space-y-3">
          <div className="flex flex-col space-y-1 text-[14px] font-medium">
            {navItems.map((item) => {
              if (item.isAnchor) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={handleRecentClick}
                    className="py-2.5 px-4 rounded-full transition-colors text-left text-muted hover:text-ink hover:bg-sunken cursor-pointer"
                  >
                    {item.label}
                  </button>
                );
              }
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 px-4 rounded-full transition-colors ${
                    isActive
                      ? "text-ink font-semibold bg-sunken"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-hairline flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/lakshmanbhukya"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-sunken border border-hairline text-muted hover:text-ink flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/lakshmanbhukya"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-sunken border border-hairline text-muted hover:text-ink flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>

            {token ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Log out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
