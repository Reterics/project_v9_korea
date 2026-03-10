const API_BASE = import.meta.env.VITE_API_URL ?? "";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;
let onAuthExpired: (() => void) | null = null;

// --- Token management ---

export function setTokens(access: string | null, refresh: string | null) {
  accessToken = access;
  refreshToken = refresh;
  if (access) {
    localStorage.setItem("access_token", access);
  } else {
    localStorage.removeItem("access_token");
  }
  if (refresh) {
    localStorage.setItem("refresh_token", refresh);
  } else {
    localStorage.removeItem("refresh_token");
  }
}

export function clearTokens() {
  setTokens(null, null);
}

export function getAuthToken(): string | null {
  if (!accessToken) {
    accessToken = localStorage.getItem("access_token");
  }
  return accessToken;
}

export function getRefreshToken(): string | null {
  if (!refreshToken) {
    refreshToken = localStorage.getItem("refresh_token");
  }
  return refreshToken;
}

/**
 * Register a callback invoked when auth is fully expired
 * (refresh token also invalid).
 */
export function onAuthExpiredCallback(cb: () => void) {
  onAuthExpired = cb;
}

// --- Token refresh ---

async function attemptRefresh(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });

    if (!res.ok) return false;

    const data = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// --- HTTP request layer ---

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isRetry = false,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 401 — try refresh once
  if (res.status === 401 && !isRetry && getRefreshToken()) {
    // Coalesce concurrent refresh attempts
    if (!refreshPromise) {
      refreshPromise = attemptRefresh().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;
    if (refreshed) {
      return request<T>(method, path, body, true);
    }

    // Refresh failed — fully expired
    clearTokens();
    onAuthExpired?.();
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  // Handle 429
  if (res.status === 429) {
    const data = await res.json().catch(() => ({}));
    const retryAfter = (data as { retryAfter?: number }).retryAfter;
    const msg = (data as { error?: string }).error ?? "Too many requests";
    const err = new ApiError(msg, 429);
    err.retryAfter = retryAfter;
    throw err;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const parsed = data as { error?: string; code?: string };
    const err = new ApiError(
      parsed.error ?? `HTTP ${res.status}`,
      res.status,
    );
    err.code = parsed.code;
    throw err;
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  retryAfter?: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
