import { useEffect, useState } from "react";

type FeedbackToastProps = {
  type: "correct" | "wrong" | null;
  durationMs?: number;
};

export function FeedbackToast({ type, durationMs = 800 }: FeedbackToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), durationMs);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [type, durationMs]);

  if (!visible || !type) return null;

  return (
    <div
      className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 rounded-2xl text-2xl font-bold shadow-lg z-50 animate-pulse ${
        type === "correct"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {type === "correct" ? "Correct!" : "Wrong"}
    </div>
  );
}
