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
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <div
                className={
                  "flex h-9 w-9 items-center justify-center rounded-2xl " +
                  (data.ok
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100")
                }
              >
                {data.ok ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </div>
              <div className="text-sm font-semibold">{data.msg}</div>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Auto next</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
