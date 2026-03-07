import { useState } from "react";

// Pure display component — timing and data state are owned by AppDataProvider

export function SplashScreen({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(true);

  if (!mounted) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      onTransitionEnd={() => { if (visible) setMounted(false); }}
      style={{
        background: "linear-gradient(160deg, #1B3050 0%, #0F1A2B 60%, #0A1119 100%)",
        opacity: visible ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        pointerEvents: visible ? "none" : "auto",
      }}
    >
      {/* Decorative background glows — system palette colours at low opacity */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "#2B4C7E" /* namsaek-500 */ }}
        />
        <div
          className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full opacity-15 blur-3xl"
          style={{ background: "#5EAD99" /* cheongja-400 */ }}
        />
        <div
          className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "#D4B96C" /* geum-300 */ }}
        />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo card */}
        <div
          className="flex items-center justify-center rounded-3xl p-5 shadow-2xl"
          style={{
            background: "rgba(43,76,126,0.2)" /* namsaek-500 at low opacity */,
            border: "1px solid rgba(126,152,190,0.25)" /* namsaek-300 */,
            backdropFilter: "blur(8px)",
          }}
        >
          <img
            src="/brand/logo-primary.svg"
            alt="My Korean Birdie"
            style={{
              height: 96,
              width: "auto",
              filter: "drop-shadow(0 4px 24px rgba(43,76,126,0.6))" /* namsaek-500 */,
            }}
          />
        </div>

        {/* App name */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: "#EEF2F7" /* namsaek-50 */, letterSpacing: "-0.02em" }}
          >
            My Korean Birdie
          </h1>
          <p className="text-base font-medium" style={{ color: "#ADBDD7" /* namsaek-200 */ }}>
            나의 한국어 버디
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2 pt-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{
                background: "#7E98BE" /* namsaek-300 */,
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
