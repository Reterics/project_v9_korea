import type { ReactNode } from "react";
import { SplashScreen } from "@reterics/birdie-ui";
import { useAuth } from "./AuthProvider";
import { LoginPage } from "./LoginPage";

export function AuthGate({ children }: { children: ReactNode }) {
  const { auth } = useAuth();

  if (auth.status === "loading") return <SplashScreen />;
  if (auth.status === "unauthenticated") return <LoginPage />;

  return <>{children}</>;
}
