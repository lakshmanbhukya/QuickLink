const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token) => localStorage.setItem("token", token);
export const removeAuthToken = () => localStorage.removeItem("token");

export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Session storage history helpers (cleared automatically when browser/tab closes)
const RECENT_LINKS_KEY = "quicklink_recent_links";

export const getRecentLinks = () => {
  try {
    const raw = sessionStorage.getItem(RECENT_LINKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRecentLink = (item) => {
  try {
    const existing = getRecentLinks();
    // Filter out duplicates by code
    const filtered = existing.filter((link) => link.code !== item.code);
    const updated = [
      {
        code: item.code,
        targetUrl: item.targetUrl,
        createdAt: item.createdAt || new Date().toISOString(),
        expiresAt: item.expiresAt || null,
      },
      ...filtered,
    ].slice(0, 10); // Keep last 10
    sessionStorage.setItem(RECENT_LINKS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const clearRecentLinks = () => {
  sessionStorage.removeItem(RECENT_LINKS_KEY);
};

export const QR_PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="white" rx="16"/><rect x="20" y="20" width="45" height="45" rx="10" fill="%230f172a"/><rect x="27" y="27" width="31" height="31" rx="6" fill="white"/><rect x="34" y="34" width="17" height="17" rx="3" fill="%230f172a"/><rect x="135" y="20" width="45" height="45" rx="10" fill="%230f172a"/><rect x="142" y="27" width="31" height="31" rx="6" fill="white"/><rect x="149" y="34" width="17" height="17" rx="3" fill="%230f172a"/><rect x="20" y="135" width="45" height="45" rx="10" fill="%230f172a"/><rect x="27" y="142" width="31" height="31" rx="6" fill="white"/><rect x="34" y="149" width="17" height="17" rx="3" fill="%230f172a"/><rect x="80" y="20" width="12" height="12" rx="3" fill="%230f172a"/><rect x="98" y="20" width="12" height="12" rx="3" fill="%230f172a"/><rect x="80" y="38" width="12" height="12" rx="3" fill="%230f172a"/><rect x="116" y="38" width="12" height="12" rx="3" fill="%230f172a"/><rect x="98" y="56" width="12" height="12" rx="3" fill="%230f172a"/><rect x="80" y="74" width="12" height="12" rx="3" fill="%230f172a"/><rect x="116" y="74" width="12" height="12" rx="3" fill="%230f172a"/><rect x="20" y="80" width="12" height="12" rx="3" fill="%230f172a"/><rect x="38" y="80" width="12" height="12" rx="3" fill="%230f172a"/><rect x="56" y="80" width="12" height="12" rx="3" fill="%230f172a"/><rect x="20" y="98" width="12" height="12" rx="3" fill="%230f172a"/><rect x="56" y="98" width="12" height="12" rx="3" fill="%230f172a"/><rect x="38" y="116" width="12" height="12" rx="3" fill="%230f172a"/><rect x="135" y="80" width="12" height="12" rx="3" fill="%230f172a"/><rect x="153" y="80" width="12" height="12" rx="3" fill="%230f172a"/><rect x="171" y="80" width="12" height="12" rx="3" fill="%230f172a"/><rect x="135" y="98" width="12" height="12" rx="3" fill="%230f172a"/><rect x="171" y="98" width="12" height="12" rx="3" fill="%230f172a"/><rect x="153" y="116" width="12" height="12" rx="3" fill="%230f172a"/><rect x="80" y="135" width="12" height="12" rx="3" fill="%230f172a"/><rect x="98" y="135" width="12" height="12" rx="3" fill="%230f172a"/><rect x="116" y="135" width="12" height="12" rx="3" fill="%230f172a"/><rect x="80" y="153" width="12" height="12" rx="3" fill="%230f172a"/><rect x="116" y="153" width="12" height="12" rx="3" fill="%230f172a"/><rect x="153" y="153" width="12" height="12" rx="3" fill="%230f172a"/><rect x="171" y="153" width="12" height="12" rx="3" fill="%230f172a"/><rect x="98" y="171" width="12" height="12" rx="3" fill="%230f172a"/><rect x="135" y="171" width="12" height="12" rx="3" fill="%230f172a"/><rect x="171" y="171" width="12" height="12" rx="3" fill="%230f172a"/></svg>`;

const extractErrorMessage = (data, fallback = "An unexpected error occurred") => {
  if (!data) return fallback;
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  if (typeof data.errors === "string" && data.errors.trim()) return data.errors;
  if (typeof data.errors === "object" && data.errors !== null) {
    return Object.values(data.errors).join(", ");
  }
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  return fallback;
};

// API Services matching Spring Boot Routes
export const api = {
  // Auth Routes: /api/auth
  login: async (username, password) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(extractErrorMessage(data, "Invalid username or password"));
    return data;
  },

  register: async (username, password) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(extractErrorMessage(data, "Registration failed"));
    return data;
  },

  logout: () => {
    removeAuthToken();
  },

  // QuickLink Routes: /api/quicklinks
  createQuickLink: async ({ url, alias, expiryDays }) => {
    const payload = { url };
    if (alias && alias.trim()) payload.alias = alias.trim();
    if (expiryDays !== undefined && expiryDays !== null && expiryDays !== "") {
      const parsedDays = parseInt(expiryDays, 10);
      if (!isNaN(parsedDays) && parsedDays > 0) {
        payload.expiryDays = parsedDays;
      }
    }

    const res = await fetch(`${BACKEND_URL}/api/quicklinks`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, "Failed to create quick link"));
    }
    // Save to local recent links
    saveRecentLink(data);
    return data;
  },

  getQuickLinkDetails: async (code) => {
    const res = await fetch(`${BACKEND_URL}/api/quicklinks/${encodeURIComponent(code)}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (res.status === 404) {
      throw new Error("QuickLink not found or has expired");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(extractErrorMessage(data, "Failed to fetch link details"));
    return data;
  },

  // QR Code Endpoint: returns URL to Spring Boot backend QR code generator
  getQRCodeUrl: (targetUrl, width = 250, height = 250) => {
    if (!targetUrl) return QR_PLACEHOLDER_SVG;
    return `${BACKEND_URL}/api/quicklink/qrcode?url=${encodeURIComponent(targetUrl)}&width=${width}&height=${height}`;
  },

  // Redirect route URL builder
  getShortRedirectUrl: (code) => {
    return `${BACKEND_URL}/${code}`;
  },
};
