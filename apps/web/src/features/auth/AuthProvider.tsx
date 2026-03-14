import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, AuthState } from "./authTypes";
import { validateEmail, validatePassword } from "./authTypes";
import {
  api,
  setTokens,
  clearTokens,
  getAuthToken,
  getRefreshToken,
  onAuthExpiredCallback,
} from "@/features/learn/data/apiClient";

interface AuthContextValue {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string,
    displayName: string,
  ) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
  changeDisplayName: (displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  // Listen for auth expiration from the API client (refresh token failed)
  useEffect(() => {
    onAuthExpiredCallback(() => {
      setAuth({ status: "unauthenticated" });
    });
  }, []);

  // Restore session from stored token
  useEffect(() => {
    const token = getAuthToken();
    const refresh = getRefreshToken();

    if (!token && !refresh) {
      setAuth({ status: "unauthenticated" });
      return;
    }

    api
      .get<AuthUser>("/api/v1/auth/me")
      .then((user) => {
        setAuth({ status: "authenticated", user });
      })
      .catch(() => {
        clearTokens();
        setAuth({ status: "unauthenticated" });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!validateEmail(trimmedEmail)) {
      throw new Error("Invalid email address");
    }
    if (!password) {
      throw new Error("Password is required");
    }

    const res = await api.post<TokenResponse>("/api/v1/auth/login", {
      email: trimmedEmail,
      password,
    });
    setTokens(res.accessToken, res.refreshToken);
    setAuth({ status: "authenticated", user: res.user });
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      confirmPassword: string,
      displayName: string,
    ) => {
      const trimmedEmail = email.trim().toLowerCase();

      if (!validateEmail(trimmedEmail)) {
        throw new Error("Invalid email address");
      }

      const validation = validatePassword(password);
      if (!validation.valid) {
        if (!validation.minLength)
          throw new Error("Password must be at least 8 characters");
        if (!validation.hasLetter)
          throw new Error("Password must contain at least one letter");
        if (!validation.hasDigit)
          throw new Error("Password must contain at least one digit");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const trimmedName = displayName.trim() || "Learner";

      const res = await api.post<TokenResponse>("/api/v1/auth/register", {
        email: trimmedEmail,
        password,
        confirmPassword,
        displayName: trimmedName,
      });
      setTokens(res.accessToken, res.refreshToken);
      setAuth({ status: "authenticated", user: res.user });
    },
    [],
  );

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
      confirmPassword: string,
    ) => {
      const validation = validatePassword(newPassword);
      if (!validation.valid) {
        if (!validation.minLength)
          throw new Error("New password must be at least 8 characters");
        if (!validation.hasLetter)
          throw new Error("New password must contain at least one letter");
        if (!validation.hasDigit)
          throw new Error("New password must contain at least one digit");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const res = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>("/api/v1/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Update tokens from the new pair
      setTokens(res.accessToken, res.refreshToken);
    },
    [],
  );

  const changeDisplayName = useCallback(async (displayName: string) => {
    const trimmed = displayName.trim();
    if (!trimmed) throw new Error("Display name cannot be empty");
    if (trimmed.length > 100) throw new Error("Display name must be 100 characters or fewer");

    await api.put("/api/v1/profile", { displayName: trimmed });

    setAuth((prev) => {
      if (prev.status !== "authenticated") return prev;
      return { ...prev, user: { ...prev.user, displayName: trimmed } };
    });
  }, []);

  const logout = useCallback(() => {
    // Fire-and-forget server logout (revokes refresh tokens)
    api.post("/api/v1/auth/logout").catch(() => {});
    clearTokens();
    setAuth({ status: "unauthenticated" });
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, login, register, changePassword, changeDisplayName, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
