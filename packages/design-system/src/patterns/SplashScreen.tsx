import { BrandLogo } from "../icons/BrandLogo.tsx";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-hanji-100 via-hanji-50 to-white dark:from-namsaek-950 dark:via-namsaek-900 dark:to-namsaek-950">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-namsaek-200 opacity-30 blur-3xl dark:bg-namsaek-500 dark:opacity-20" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cheongja-200 opacity-25 blur-3xl dark:bg-cheongja-400 dark:opacity-15" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-geum-200 opacity-25 blur-3xl dark:bg-geum-300 dark:opacity-15" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo card */}
        <div className="flex items-center justify-center rounded-3xl border border-namsaek-200/40 bg-namsaek-100/30 p-5 shadow-2xl backdrop-blur-sm dark:border-namsaek-300/25 dark:bg-namsaek-500/20">
          <BrandLogo
            variant="icon"
            size={96}
            className="drop-shadow-[0_4px_24px_rgba(43,76,126,0.6)]"
          />
        </div>

        {/* App name */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-namsaek-900 dark:text-namsaek-50" style={{ letterSpacing: "-0.02em" }}>
            My Korean Birdie
          </h1>
          <p className="text-base font-medium text-namsaek-500 dark:text-namsaek-200">
            나의 한국어 버디
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2 pt-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-namsaek-400 dark:bg-namsaek-300"
              style={{
                animation: `splash-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes splash-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
