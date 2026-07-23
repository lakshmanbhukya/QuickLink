import { useState } from "react";
import { api, QR_PLACEHOLDER_SVG } from "../services/api";
import { QrCode, Download, ExternalLink, Sliders } from "lucide-react";

export default function QRCodeGen() {
  const [targetUrl, setTargetUrl] = useState("https://google.com");
  const [width, setWidth] = useState(250);
  const [height, setHeight] = useState(250);
  const [activeQrUrl, setActiveQrUrl] = useState(api.getQRCodeUrl("https://google.com", 250, 250));

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    setActiveQrUrl(api.getQRCodeUrl(targetUrl.trim(), width, height));
  };

  const applyPresetSize = (size) => {
    setWidth(size);
    setHeight(size);
    if (targetUrl.trim()) {
      setActiveQrUrl(api.getQRCodeUrl(targetUrl.trim(), size, size));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in text-ink space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight font-heading">
          QR Code Studio
        </h1>
        <p className="text-muted text-sm leading-relaxed">
          Generate PNG QR codes with custom size parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-3xl mx-auto mt-8">
        {/* Controls Form Card */}
        <div className="bg-panel border border-hairline rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-body mb-1.5">
                Target URL or Text
              </label>
              <input
                type="text"
                required
                placeholder="https://example.com"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-sunken border border-hairline text-ink text-sm rounded-full py-3 px-5 focus:outline-none focus:border-accent transition-colors font-mono"
              />
            </div>

            {/* Quick Size Presets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-body flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-accent" />
                <span>Size Presets</span>
              </label>
              <div className="flex gap-2">
                {[150, 250, 400].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => applyPresetSize(size)}
                    className={`flex-1 py-2 rounded-full text-xs font-semibold border transition-colors ${
                      width === size && height === size
                        ? "bg-accent text-accent-ink border-accent"
                        : "bg-sunken text-body border-hairline hover:border-muted"
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-body mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-sunken border border-hairline text-ink text-sm rounded-full py-2.5 px-4 focus:outline-none focus:border-accent transition-colors text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-body mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-sunken border border-hairline text-ink text-sm rounded-full py-2.5 px-4 focus:outline-none focus:border-accent transition-colors text-center font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-accent-ink font-semibold py-3 rounded-full flex items-center justify-center gap-2 text-sm transition-colors shadow-md mt-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Generate QR Code</span>
            </button>
          </form>
        </div>

        {/* Output Preview Card */}
        <div className="bg-panel border border-hairline rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[340px] shadow-xl">
          {activeQrUrl ? (
            <div className="space-y-4 w-full animate-fade-in">
              <div className="bg-white p-3 rounded-2xl inline-block shadow-md border border-hairline">
                <img
                  src={activeQrUrl || QR_PLACEHOLDER_SVG}
                  alt="Generated QR Code"
                  width={Math.min(width, 220)}
                  height={Math.min(height, 220)}
                  className="mx-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = QR_PLACEHOLDER_SVG;
                  }}
                />
              </div>
              <p className="text-xs text-muted truncate max-w-xs mx-auto font-mono bg-sunken p-2.5 rounded-full border border-hairline">
                {targetUrl}
              </p>
              <div className="flex gap-2 justify-center pt-1">
                <a
                  href={activeQrUrl}
                  download="quicklink-qrcode.png"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    type="button"
                    className="bg-accent hover:bg-accent-hover text-accent-ink font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </a>
                <a
                  href={activeQrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-hairline hover:border-muted text-muted hover:text-ink rounded-full p-2 transition-colors flex items-center justify-center"
                  title="Open image in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-faint space-y-2">
              <QrCode className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-xs">Enter a URL to generate QR Code preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
