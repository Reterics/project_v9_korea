import { useEffect, useRef, useCallback } from "react";
import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Dialog width preset */
  size?: DialogSize;
  /** Whether clicking the backdrop closes the dialog */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the dialog */
  closeOnEscape?: boolean;
  className?: string;
};

type DialogHeaderProps = {
  children: ReactNode;
  /** Show a close (X) button in the header */
  onClose?: () => void;
  className?: string;
};

type DialogBodyProps = {
  children: ReactNode;
  className?: string;
};

type DialogFooterProps = {
  children: ReactNode;
  className?: string;
};

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)]",
};

export function Dialog({
  open,
  onClose,
  children,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = "",
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose, closeOnEscape]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap — move focus into panel when opened
  useEffect(() => {
    if (open && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: ReactMouseEvent) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose],
  );

  return (
    <div
      className={
        "fixed inset-0 z-50" + (open ? "" : " pointer-events-none")
      }
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={
          "absolute inset-0 bg-black/40 transition-opacity duration-200 " +
          (open ? "opacity-100" : "opacity-0")
        }
        aria-hidden="true"
      />

      {/* Centering wrapper */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className={
            "w-full rounded-3xl border border-hanji-300 bg-white shadow-xl transition-all duration-200 dark:border-namsaek-700 dark:bg-namsaek-900 " +
            sizeClasses[size] +
            (open
              ? " scale-100 opacity-100"
              : " scale-95 opacity-0") +
            (className ? " " + className : "")
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({
  children,
  onClose,
  className = "",
}: DialogHeaderProps) {
  return (
    <div
      className={
        "flex items-center justify-between border-b border-hanji-200 px-6 py-4 dark:border-namsaek-700" +
        (className ? " " + className : "")
      }
    >
      <h2 className="text-lg font-semibold text-namsaek-900 dark:text-hanji-50">
        {children}
      </h2>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-lg p-2 text-namsaek-500 outline-none transition hover:bg-hanji-200 focus-visible:ring-2 focus-visible:ring-namsaek-300 dark:text-hanji-300 dark:hover:bg-namsaek-800 dark:focus-visible:ring-namsaek-600 cursor-pointer"
          aria-label="Close dialog"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function DialogBody({ children, className = "" }: DialogBodyProps) {
  return (
    <div
      className={
        "px-6 py-4 text-sm text-namsaek-700 dark:text-hanji-300" +
        (className ? " " + className : "")
      }
    >
      {children}
    </div>
  );
}

export function DialogFooter({ children, className = "" }: DialogFooterProps) {
  return (
    <div
      className={
        "flex items-center justify-end gap-3 border-t border-hanji-200 px-6 py-4 dark:border-namsaek-700" +
        (className ? " " + className : "")
      }
    >
      {children}
    </div>
  );
}