import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, TriangleAlert, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  durationMs?: number;
};

type ToastInput = Omit<ToastItem, "id"> & {
  id?: string;
};

type ToastContextValue = {
  toasts: ToastItem[];
  addToast: (toast: ToastInput) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

type ToastProviderProps = {
  children: ReactNode;
  maxVisible?: number;
  defaultDurationMs?: number;
};

type ToastViewportProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: "bottom" | "top";
  className?: string;
};

type ToastProps = {
  toast: ToastItem;
  onDismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClasses: Record<ToastVariant, string> = {
  success:
    "border-cheongja-200 bg-cheongja-50 text-cheongja-800 dark:border-cheongja-700 dark:bg-cheongja-900/90 dark:text-cheongja-100",
  error:
    "border-dancheong-200 bg-dancheong-50 text-dancheong-800 dark:border-dancheong-700 dark:bg-dancheong-900/90 dark:text-dancheong-100",
  info:
    "border-namsaek-200 bg-white text-namsaek-800 dark:border-namsaek-700 dark:bg-namsaek-900/90 dark:text-hanji-100",
};

const iconClasses: Record<ToastVariant, string> = {
  success: "bg-cheongja-500 text-white",
  error: "bg-dancheong-500 text-white",
  info: "bg-namsaek-500 text-white",
};

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") return <Check className="h-5 w-5" />;
  if (variant === "error") return <TriangleAlert className="h-5 w-5" />;
  return <Info className="h-5 w-5" />;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.16 }}
      className={"pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur " + variantClasses[toast.variant]}
      role={toast.variant === "error" ? "alert" : "status"}
    >
      <div className="flex items-start gap-3">
        <div className={"mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl " + iconClasses[toast.variant]}>
          <ToastIcon variant={toast.variant} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{toast.title}</div>
          {toast.description && (
            <div className="mt-0.5 text-sm opacity-80">{toast.description}</div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg opacity-70 transition hover:bg-white/50 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namsaek-300 dark:hover:bg-namsaek-800"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
  position = "bottom",
  className = "",
}: ToastViewportProps) {
  return (
    <div
      className={
        "pointer-events-none fixed left-1/2 z-50 flex w-[min(420px,calc(100vw-24px))] -translate-x-1/2 flex-col gap-2 " +
        (position === "top" ? "top-4" : "bottom-4") +
        (className ? " " + className : "")
      }
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function ToastProvider({
  children,
  maxVisible = 3,
  defaultDurationMs = 4000,
}: ToastProviderProps) {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setQueue((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: ToastInput) => {
    const id = toast.id ?? createToastId();
    setQueue((current) => [...current, { ...toast, id }]);
    return id;
  }, []);

  const clearToasts = useCallback(() => setQueue([]), []);
  const visibleToasts = useMemo(() => queue.slice(0, maxVisible), [maxVisible, queue]);

  useEffect(() => {
    if (visibleToasts.length === 0) return;

    const timers = visibleToasts.map((toast) =>
      window.setTimeout(
        () => removeToast(toast.id),
        toast.durationMs ?? defaultDurationMs,
      ),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [defaultDurationMs, removeToast, visibleToasts]);

  const value = useMemo(
    () => ({ toasts: queue, addToast, removeToast, clearToasts }),
    [addToast, clearToasts, queue, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={visibleToasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
