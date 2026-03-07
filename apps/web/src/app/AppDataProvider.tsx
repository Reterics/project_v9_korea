import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SplashScreen } from "./SplashScreen";

interface AppDataContextValue {
  isReady: boolean;
}

const AppDataContext = createContext<AppDataContextValue>({ isReady: false });

export function useAppData() {
  return useContext(AppDataContext);
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // TODO: replace with real API data fetching when backend is available
    const timer = setTimeout(() => setIsReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppDataContext.Provider value={{ isReady }}>
      <SplashScreen visible={isReady} />
      {isReady && children}
    </AppDataContext.Provider>
  );
}
