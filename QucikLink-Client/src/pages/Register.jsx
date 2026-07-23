import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, setAuthToken } from "../services/api";
import { User, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await api.register(username, password);
      if (data.token) {
        setAuthToken(data.token);
        setMessage("Account created! Signing you in...");
        setTimeout(() => navigate("/"), 1200);
      } else {
        setMessage("Account created! Signing you in...");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in text-ink">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight font-heading">
          Create your account.
        </h1>
        <p className="text-muted text-sm leading-relaxed">
          Reserve custom aliases and keep track of every click.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-panel border border-hairline rounded-3xl p-6 sm:p-8 max-w-md mx-auto mt-8 space-y-5 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Choose Username Field */}
          <div>
            <label
              htmlFor="register-username"
              className="block text-xs font-semibold text-body mb-1.5"
            >
              Choose a username
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-faint absolute left-4 pointer-events-none" />
              <input
                id="register-username"
                type="text"
                required
                placeholder="e.g. john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-sunken border border-hairline text-ink placeholder:text-faint text-sm rounded-full py-3 pl-11 pr-5 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="register-password"
              className="block text-xs font-semibold text-body mb-1.5"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-faint absolute left-4 pointer-events-none" />
              <input
                id="register-password"
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-sunken border border-hairline text-ink placeholder:text-faint text-sm rounded-full py-3 pl-11 pr-5 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <span className="text-[12px] text-muted mt-1.5 block">
              Use 6+ characters — a passphrase works great.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-accent-ink font-semibold py-3 rounded-full flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50 shadow-md mt-2"
          >
            <span>{loading ? "Creating account..." : "Create account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Success Banner */}
        {message && (
          <div className="bg-teal-50 dark:bg-[#122824] border border-teal-200 dark:border-[#1e4d43] text-teal-800 dark:text-accent rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
            <span>{message}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl py-3 px-4 flex items-center gap-2 text-xs font-medium animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer Link inside card */}
        <div className="pt-2 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent-text hover:underline font-semibold"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Bottom Subtitle / Note */}
      <p className="text-xs text-muted text-center mt-6">
        Free forever — no credit card, no tracking.
      </p>
    </div>
  );
}
