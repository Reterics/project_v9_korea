import { Check, Lock, Play } from "lucide-react";

type LessonStatus = "done" | "in_progress" | "locked";

type LessonStatusIconProps = {
  status: LessonStatus;
  className?: string;
};

const statusConfig: Record<LessonStatus, { icon: typeof Check; color: string }> = {
  done: { icon: Check, color: "text-cheongja-500 dark:text-cheongja-400" },
  in_progress: { icon: Play, color: "text-namsaek-500 dark:text-namsaek-400" },
  locked: { icon: Lock, color: "text-hanji-400 dark:text-hanji-600" },
};

export function LessonStatusIcon({ status, className = "" }: LessonStatusIconProps) {
  const { icon: Icon, color } = statusConfig[status];
  return <Icon className={`h-4 w-4 ${color} ${className}`} />;
}