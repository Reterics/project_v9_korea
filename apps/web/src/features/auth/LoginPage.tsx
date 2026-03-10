import { useState } from "react";
import { BrandLogo } from "@reterics/birdie-ui";
import { useAuth } from "./AuthProvider";
import { validateEmail, validatePassword } from "./authTypes";
import { ApiError } from "@/features/learn/data/apiClient";

type Mode = "login" | "register";

function friendlyError(err: unknown): string {
  if (err instanceof ApiError) {
    // Network-level or server errors
    if (err.status === 0 || err.status >= 500) {
      return "Could not reach the server. Please check your connection and try again.";
    }
    if (err.status === 429) {
      return "Too many attempts. Please wait a moment and try again.";
    }
    // The API already returns human-readable messages for 4xx
    return err.message;
  }
  if (err instanceof TypeError && err.message === "Failed to fetch") {
    return "Could not reach the server. Please check your connection and try again.";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordCheck = validatePassword(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, confirmPassword, displayName);
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hanji-100 p-4 dark:bg-namsaek-950">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <BrandLogo variant="primary" size={48} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-hanji-300 bg-white p-6 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900"
        >
          <h2 className="mb-4 text-center text-lg font-semibold text-namsaek-900 dark:text-hanji-100">
            {mode === "login" ? "Log in" : "Create account"}
          </h2>

          {error && (
            <div className="mb-4 rounded-xl border border-dancheong-200 bg-dancheong-50 px-3 py-2 text-sm text-dancheong-700 dark:border-dancheong-800 dark:bg-dancheong-900/30 dark:text-dancheong-300">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {mode === "register" && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-hanji-500 dark:text-hanji-400">
                  Display name
                </span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Learner"
                  maxLength={50}
                  className="w-full rounded-xl border border-hanji-300 bg-white px-3 py-2 text-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-hanji-500 dark:text-hanji-400">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-hanji-300 bg-white px-3 py-2 text-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-hanji-500 dark:text-hanji-400">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full rounded-xl border border-hanji-300 bg-white px-3 py-2 text-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200"
              />
            </label>

            {mode === "register" && password.length > 0 && (
              <div className="space-y-1 text-xs">
                <Rule ok={passwordCheck.minLength} label="At least 8 characters" />
                <Rule ok={passwordCheck.hasLetter} label="Contains a letter" />
                <Rule ok={passwordCheck.hasDigit} label="Contains a digit" />
              </div>
            )}

            {mode === "register" && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-hanji-500 dark:text-hanji-400">
                  Confirm password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-hanji-300 bg-white px-3 py-2 text-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200"
                />
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <span className="mt-1 block text-xs text-dancheong-500">
                    Passwords do not match
                  </span>
                )}
              </label>
            )}

            <button
              type="submit"
              disabled={loading || (mode === "register" && (!passwordCheck.valid || !validateEmail(email) || password !== confirmPassword))}
              className="w-full rounded-xl bg-namsaek-500 px-4 py-2.5 text-sm font-semibold text-hanji-50 transition hover:bg-namsaek-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-hanji-500 dark:text-hanji-400">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(""); }}
                  className="font-medium text-namsaek-500 hover:underline dark:text-namsaek-400"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); }}
                  className="font-medium text-namsaek-500 hover:underline dark:text-namsaek-400"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Rule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={ok ? "text-cheongja-600 dark:text-cheongja-400" : "text-hanji-400 dark:text-hanji-500"}>
      {ok ? "\u2713" : "\u2022"} {label}
    </div>
  );
}
