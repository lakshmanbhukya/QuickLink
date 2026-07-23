import { useState } from "react";
import { api, QR_PLACEHOLDER_SVG, getRecentLinks, clearRecentLinks } from "../services/api";
import * as Tabs from "@radix-ui/react-tabs";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Link2,
  Copy,
  Check,
  QrCode,
  Download,
  AlertCircle,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Plus,
  Minus,
  X,
  Clock,
  Trash2,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What is a URL shortener?",
    a: "A URL shortener takes long, complex web links and turns them into clean, short addresses that are easy to share and automatically redirect visitors to the original site.",
  },
  {
    q: "Can I create custom link aliases?",
    a: "Yes! When logged in, you can create custom short names for your links (like a custom brand name) to make them memorable.",
  },
  {
    q: "Are QR codes free to download?",
    a: "Yes, every link you shorten includes a free downloadable PNG QR code that anyone can scan with their phone camera.",
  },
  {
    q: "How does link expiration work?",
    a: "You can choose how long a link stays active (from 1 day to 1 year). Once it expires, the short link stops redirecting automatically.",
  },
];

const FEATURES = [
  { title: "Fast redirects", description: "Warm links resolve from an edge cache." },
  { title: "Custom aliases", description: "Name your link something memorable." },
  { title: "Click counts", description: "See every redirect as it happens." },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("shorten");
  const [url, setUrl] = useState("");
  const [domain, setDomain] = useState("quicklink.live");
  const [alias, setAlias] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [showCustomize, setShowCustomize] = useState(false);

  // QR tab state
  const [qrTargetUrl, setQrTargetUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdLink, setCreatedLink] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [recentLinks, setRecentLinks] = useState(() => getRecentLinks());

  const handleSubmitShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCreatedLink(null);
    setCopiedCode(null);

    let processedUrl = url.trim();
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = `https://${processedUrl}`;
    }

    try {
      const data = await api.createQuickLink({
        url: processedUrl,
        alias,
        expiryDays,
      });
      setCreatedLink(data);
      setUrl("");
      setAlias("");
      setExpiryDays("");
      setRecentLinks(getRecentLinks());
    } catch (err) {
      setError(err.message || "Failed to create quick link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, codeKey = "main") => {
    navigator.clipboard.writeText(text);
    setCopiedCode(codeKey);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const shortUrl = createdLink ? api.getShortRedirectUrl(createdLink.code) : "";

  return (
    <div className="text-ink">
      {/* Hero + Tool */}
      <section className="max-w-xl mx-auto px-4 pt-12 sm:pt-16 pb-14 text-center">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl sm:leading-[1.15] tracking-tight text-ink">
          Paste a long link.
          <br className="hidden sm:block" /> Get a short one.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted max-w-md mx-auto">
          Custom aliases, QR codes, and click counts — free, no account needed.
        </p>

        {/* Tool Panel */}
        <div className="mt-8 text-left bg-panel border border-hairline rounded-3xl p-6 sm:p-8 shadow-2xl">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List
              aria-label="Choose tool"
              className="inline-flex items-center bg-sunken border border-hairline rounded-full p-1"
            >
              <Tabs.Trigger
                value="shorten"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-accent data-[state=active]:text-accent-ink focus:outline-none"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Shorten link</span>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="qr"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-accent data-[state=active]:text-accent-ink focus:outline-none"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR code</span>
              </Tabs.Trigger>
            </Tabs.List>

            {/* Shorten Tab */}
            <Tabs.Content value="shorten" className="focus:outline-none mt-5">
              <form onSubmit={handleSubmitShorten} className="space-y-4">
                <div className="relative flex items-center">
                  <Link2 className="w-4 h-4 text-faint absolute left-4 pointer-events-none" />
                  <input
                    type="url"
                    aria-label="Destination long URL"
                    placeholder="https://your-very-long-link.com/goes-here"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="w-full bg-sunken border border-hairline text-ink placeholder:text-faint text-sm rounded-full py-3.5 pl-11 pr-5 focus:outline-none focus:border-accent transition-colors font-mono"
                  />
                </div>

                {/* Customize section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowCustomize((v) => !v)}
                      className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors font-medium cursor-pointer"
                      aria-expanded={showCustomize}
                    >
                      <span>Customize</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${showCustomize ? "rotate-180" : ""}`}
                      />
                    </button>

                    {!showCustomize && (
                      <span className="text-faint text-[11px]">
                        {expiryDays ? `Expires in ${expiryDays} days` : "Expires: 1 day"}
                      </span>
                    )}
                  </div>

                  {/* Expanded Customize Panel */}
                  {showCustomize && (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 animate-fade-in">
                      {/* Custom Alias Field with Floating Label */}
                      <div className="sm:col-span-7 relative bg-sunken border border-hairline rounded-2xl px-4 pt-4 pb-2 focus-within:border-accent transition-colors">
                        <input
                          id="custom-alias-input"
                          type="text"
                          placeholder=" "
                          value={alias}
                          onChange={(e) => setAlias(e.target.value)}
                          aria-label="Custom alias"
                          className="peer w-full bg-transparent text-ink text-sm focus:outline-none font-mono"
                        />
                        <label
                          htmlFor="custom-alias-input"
                          className="absolute left-4 top-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-faint peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-accent pointer-events-none"
                        >
                          Custom Alias
                        </label>
                      </div>

                      {/* Expiration Field with Floating Label */}
                      <div className="sm:col-span-5 relative bg-sunken border border-hairline rounded-2xl px-4 pt-4 pb-2 focus-within:border-accent transition-colors">
                        <input
                          id="expiry-days-input"
                          type="number"
                          min="1"
                          max="365"
                          placeholder=" "
                          value={expiryDays}
                          onChange={(e) => setExpiryDays(e.target.value)}
                          aria-label="Expiration in days"
                          className="peer w-full bg-transparent text-ink text-sm focus:outline-none font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <label
                          htmlFor="expiry-days-input"
                          className="absolute left-4 top-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-faint peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-accent pointer-events-none"
                        >
                          Expiration (in days)
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent-hover text-accent-ink font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50 shadow-md"
                >
                  <span>{loading ? "Shortening..." : "Shorten link"}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </Tabs.Content>

            {/* QR Tab */}
            <Tabs.Content value="qr" className="focus:outline-none mt-5">
              <div className="space-y-4">
                <div className="relative flex items-center">
                  <QrCode className="w-4 h-4 text-faint absolute left-4 pointer-events-none" />
                  <input
                    type="url"
                    aria-label="Target URL for QR code"
                    placeholder="https://example.com"
                    value={qrTargetUrl}
                    onChange={(e) => setQrTargetUrl(e.target.value)}
                    className="w-full bg-sunken border border-hairline text-ink placeholder:text-faint text-sm rounded-full py-3.5 pl-11 pr-5 focus:outline-none focus:border-accent transition-colors font-mono"
                  />
                </div>

                {qrTargetUrl.trim() ? (
                  <div className="text-center space-y-3 pt-2">
                    <div className="bg-white p-3 rounded-2xl inline-block shadow-md border border-hairline">
                      <img
                        src={api.getQRCodeUrl(qrTargetUrl.trim(), 250, 250)}
                        alt="Generated QR code"
                        className="w-36 h-36 mx-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.src = QR_PLACEHOLDER_SVG;
                        }}
                      />
                    </div>
                    <div>
                      <a
                        href={api.getQRCodeUrl(qrTargetUrl.trim(), 400, 400)}
                        download="quicklink-qr.png"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button
                          type="button"
                          className="bg-accent hover:bg-accent-hover text-accent-ink font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 mx-auto transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PNG</span>
                        </button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted text-center py-6">
                    Enter a URL above to generate a downloadable QR code.
                  </p>
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Result State Card */}
        {createdLink && activeTab === "shorten" && (
          <div className="mt-4 text-left bg-panel border border-hairline rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-accent bg-accent-soft font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Link ready</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="border border-hairline hover:border-muted text-muted hover:text-ink rounded-full p-2 transition-colors"
                  aria-label="View QR code"
                  title="View QR code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-hairline hover:border-muted text-muted hover:text-ink rounded-full p-2 transition-colors"
                  aria-label="Open short link"
                  title="Open short link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="font-mono font-bold text-xl text-accent break-all">
                {shortUrl.replace(/^https?:\/\//, "")}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(shortUrl, "main")}
                className="bg-accent hover:bg-accent-hover text-accent-ink font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                {copiedCode === "main" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === "main" ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <p className="text-xs text-muted truncate">
              → {createdLink.targetUrl} · {createdLink.hits ?? 0} clicks ·{" "}
              {createdLink.expiresAt
                ? `Expires ${new Date(createdLink.expiresAt).toLocaleDateString()}`
                : "Never expires"}
            </p>
          </div>
        )}
      </section>

      {/* Session Recent Links Section - Expanded max-w-4xl container */}
      <section id="recent-links" className="max-w-4xl mx-auto px-4 py-4">
        {recentLinks.length > 0 ? (
          <div className="bg-panel border border-hairline rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent-soft border border-hairline flex items-center justify-center text-accent">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-ink">
                    Recent Links
                  </h3>
                  <p className="text-[11px] text-muted">Active browser session history</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-sunken border border-hairline px-2.5 py-0.5 rounded-full ml-1">
                  {recentLinks.length} {recentLinks.length === 1 ? "link" : "links"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearRecentLinks();
                  setRecentLinks([]);
                }}
                className="text-xs font-medium text-muted hover:text-red-500 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-hairline hover:border-red-200 dark:hover:border-red-900 bg-sunken cursor-pointer"
                title="Clear recent session links"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear session</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {recentLinks.map((item) => {
                const itemShortUrl = api.getShortRedirectUrl(item.code);
                const isItemCopied = copiedCode === item.code;
                return (
                  <div
                    key={item.code}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-sunken border border-hairline hover:border-accent/40 p-4 rounded-2xl transition-all shadow-xs hover:shadow-md"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-base text-accent break-all tracking-tight">
                          {itemShortUrl.replace(/^https?:\/\//, "")}
                        </span>
                        {item.expiresAt && (
                          <span className="text-[10px] text-faint border border-hairline px-2 py-0.5 rounded-full shrink-0">
                            {new Date(item.expiresAt) < new Date() ? "Expired" : "Active"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted truncate font-mono max-w-xl">
                        → {item.targetUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(itemShortUrl, item.code)}
                        className="bg-panel hover:bg-hairline text-ink border border-hairline font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        {isItemCopied ? (
                          <Check className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{isItemCopied ? "Copied" : "Copy"}</span>
                      </button>

                      <a
                        href={itemShortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-muted hover:text-ink border border-hairline hover:border-muted rounded-full transition-colors bg-panel"
                        title="Open short link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-faint text-center pt-2">
              Session links are saved in browser memory and clear automatically when tab is closed.
            </p>
          </div>
        ) : null}
      </section>

      {/* Feature Strip */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-hairline text-center">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="px-4 pt-6 sm:pt-0 first:pt-0">
              <h3 className="font-heading font-bold text-lg text-ink">
                {feature.title}
              </h3>
              <p className="mt-1 text-md text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-xl mx-auto px-4 pb-16 mt-10">
        <h2 className="font-heading font-bold text-3xl text-ink mb-3">FAQ's</h2>
        <Accordion.Root type="single" defaultValue="faq-0" collapsible>
          {FAQ_ITEMS.map((item, idx) => (
            <Accordion.Item
              key={item.q}
              value={`faq-${idx}`}
              className="border-t border-hairline last:border-b"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="group flex flex-1 items-center justify-between py-4 text-left text-md font-medium text-body transition-colors hover:text-ink focus:outline-none">
                  {item.q}
                  <span className="ml-4 shrink-0 text-faint group-data-[state=open]:text-accent transition-colors">
                    <Plus className="w-4 h-4 group-data-[state=open]:hidden" />
                    <Minus className="w-4 h-4 hidden group-data-[state=open]:block" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden pb-4 pr-8 text-sm leading-relaxed text-muted">
                {item.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>

      {/* QR Code Dialog */}
      <Dialog.Root open={showQrModal} onOpenChange={setShowQrModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50 backdrop-blur-xs" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-xs bg-panel border border-hairline rounded-3xl p-6 space-y-4 text-center focus:outline-none shadow-2xl">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-sm font-bold font-heading text-ink">
                QR Code
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-faint hover:text-ink transition-colors"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description className="sr-only">
              QR code linking to your shortened URL
            </Dialog.Description>

            {createdLink && (
              <>
                <div className="bg-white p-3 rounded-2xl inline-block shadow-md border border-hairline">
                  <img
                    src={api.getQRCodeUrl(shortUrl, 200, 200)}
                    alt="QR code"
                    className="w-36 h-36 mx-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src = QR_PLACEHOLDER_SVG;
                    }}
                  />
                </div>

                <p className="text-xs font-mono text-body truncate bg-sunken px-3 py-2 rounded-full border border-hairline">
                  {shortUrl.replace(/^https?:\/\//, "")}
                </p>

                <div className="flex gap-2 pt-1">
                  <a
                    href={api.getQRCodeUrl(shortUrl, 400, 400)}
                    download={`quicklink-${createdLink.code}.png`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <button
                      type="button"
                      className="w-full bg-accent hover:bg-accent-hover text-accent-ink font-semibold text-xs py-2 rounded-full flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </a>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-semibold rounded-full border border-hairline text-body hover:text-ink hover:bg-sunken transition-colors"
                    >
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
