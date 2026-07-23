import { useState } from "react";
import { api, QR_PLACEHOLDER_SVG } from "../services/api";
import { Search, ExternalLink, Copy, Check, Download, AlertCircle, ArrowRight } from "lucide-react";

export default function Lookup() {
  const [code, setCode] = useState("");
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    // Clean up user input if full URL was pasted (e.g. quicklink.live/summer-sale -> summer-sale)
    let cleanCode = code.trim().replace(/^https?:\/\//i, "");
    if (cleanCode.includes("/")) {
      cleanCode = cleanCode.split("/").pop();
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.getQuickLinkDetails(cleanCode);
      setLinkData(data);
    } catch (err) {
      setError(err.message || "QuickLink code not found or link has expired");
      setLinkData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortRedirectUrl = linkData
    ? api.getShortRedirectUrl(linkData.code)
    : "";

  const shortDisplayUrl = linkData
    ? shortRedirectUrl.replace(/^https?:\/\//, "")
    : "";

  const qrImageUrl = linkData
    ? api.getQRCodeUrl(shortRedirectUrl, 250, 250)
    : "";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in text-ink">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight font-heading">
          How is your link doing?
        </h1>
        <p className="text-muted text-sm leading-relaxed">
          Enter a short code or alias to see its destination and click counts.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleLookup} className="max-w-xl mx-auto mt-8">
        <div className="bg-sunken border border-hairline rounded-full p-2 pl-5 flex items-center gap-3 shadow-lg focus-within:border-accent transition-colors">
          <Search className="w-5 h-5 text-faint shrink-0" />
          <input
            id="lookup-code-input"
            type="text"
            required
            placeholder="quicklink.live/summer-sale"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-transparent border-0 text-ink placeholder:text-faint font-mono text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-accent-ink font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50 shadow-sm"
          >
            <span>{loading ? "Inspecting..." : "Inspect"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-xl mx-auto mt-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State Placeholder Card */}
      {!linkData && !error && !loading && (
        <div className="bg-panel border border-hairline rounded-3xl p-8 max-w-xl mx-auto mt-8 text-center space-y-3 shadow-md animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-sunken border border-hairline flex items-center justify-center mx-auto text-faint">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-ink font-heading">
            No link inspected yet
          </h3>
          <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
            Enter a short link code or alias in the search bar above to view its redirect destination and click statistics.
          </p>
        </div>
      )}

      {/* Analytics Results Card */}
      {linkData && (
        <div className="bg-panel border border-hairline rounded-3xl p-6 sm:p-8 max-w-xl mx-auto mt-8 space-y-6 shadow-2xl animate-fade-in">
          {/* Top Bar / Short Link Header */}
          <div className="space-y-3">
            <span className="text-[12px] font-medium text-muted uppercase tracking-wider block">
              Short link
            </span>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-accent font-mono font-bold text-xl sm:text-2xl tracking-tight break-all">
                {shortDisplayUrl}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(shortRedirectUrl)}
                  className="bg-accent hover:bg-accent-hover text-accent-ink font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <a
                  href={shortRedirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-hairline hover:border-muted text-muted hover:text-ink rounded-full p-2 transition-colors flex items-center justify-center"
                  title="Open redirect URL"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Destination URL */}
            <div className="pt-1 flex items-center gap-2 text-xs sm:text-sm font-mono text-muted break-all">
              <span>→</span>
              <span className="truncate">{linkData.targetUrl}</span>
            </div>
          </div>

          <div className="border-t border-hairline" />

          {/* 3-Column Metrics Row */}
          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-ink font-heading">
                {Number(linkData.hits ?? 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted font-medium">
                Total clicks
              </div>
            </div>

            <div className="border-x border-hairline px-2 space-y-1">
              <div className="text-sm sm:text-base font-bold text-ink font-heading truncate">
                {formatDate(linkData.createdAt)}
              </div>
              <div className="text-xs text-muted font-medium">
                Created
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm sm:text-base font-bold text-ink font-heading truncate">
                {formatDate(linkData.expiresAt)}
              </div>
              <div className="text-xs text-muted font-medium">
                Expires
              </div>
            </div>
          </div>

          <div className="border-t border-hairline" />

          {/* Embedded QR Code Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-1">
            <div className="space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-ink font-heading">
                QR code
              </h3>
              <p className="text-xs text-muted">
                Scan to open the short link.
              </p>
              <a
                href={qrImageUrl}
                download={`quicklink-${linkData.code || "qr"}.png`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3"
              >
                <button
                  type="button"
                  className="bg-sunken hover:bg-hairline text-ink text-xs font-semibold px-4 py-2 rounded-full border border-hairline flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              </a>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-md shrink-0 border border-hairline mx-auto sm:mx-0">
              <img
                src={qrImageUrl || QR_PLACEHOLDER_SVG}
                alt="QR Code"
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.src = QR_PLACEHOLDER_SVG;
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Subtitle / Note */}
      <p className="text-xs text-muted text-center mt-6">
        Expired links stop redirecting automatically.
      </p>
    </div>
  );
}
