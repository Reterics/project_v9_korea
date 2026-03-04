import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

type FeedbackToastProps = {
  type: "correct" | "wrong" | null;
  message?: string;
  durationMs?: number;
};

export function FeedbackToast({ type, message, durationMs = 800 }: FeedbackToastProps) {
  const [data, setData] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (type) {
      const ok = type === "correct";
      setData({
        ok,
        msg: message ?? (ok ? "Correct" : "Wrong"),
      });
      const t = setTimeout(() => setData(null), durationMs);
      return () => clearTimeout(t);
    }
    setData(null);
  }, [type, message, durationMs]);

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 w-[min(520px,calc(100vw-24px))] -translate-x-1/2"
        >
          <div
            className={
              "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-lg " +
              (data.ok
                ? "border-cheongja-200 bg-cheongja-50 dark:border-cheongja-700 dark:bg-cheongja-900/80"
                : "border-dancheong-200 bg-dancheong-50 dark:border-dancheong-700 dark:bg-dancheong-900/80")
            }
          >
            <div className="flex items-center gap-2">
              <div
                className={
                  "flex h-9 w-9 items-center justify-center rounded-2xl " +
                  (data.ok
                    ? "bg-cheongja-500 text-white"
                    : "bg-dancheong-500 text-white")
                }
              >
                {data.ok ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </div>
              <div
                className={
                  "text-sm font-semibold " +
                  (data.ok
                    ? "text-cheongja-700 dark:text-cheongja-200"
                    : "text-dancheong-700 dark:text-dancheong-200")
                }
              >
                {data.msg}
              </div>
            </div>
            <div className="text-xs text-hanji-500 dark:text-hanji-400">Auto next</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
