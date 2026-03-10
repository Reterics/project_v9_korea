import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/index";
import { AppDataProvider } from "./app/AppDataProvider";
import { IS_LIVE } from "@/features/learn/data/types";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { AuthGate } from "@/features/auth/AuthGate";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {IS_LIVE ? (
      <AuthProvider>
        <AuthGate>
          <AppDataProvider>
            <RouterProvider router={router} />
          </AppDataProvider>
        </AuthGate>
      </AuthProvider>
    ) : (
      <AppDataProvider>
        <RouterProvider router={router} />
      </AppDataProvider>
    )}
  </StrictMode>,
);
