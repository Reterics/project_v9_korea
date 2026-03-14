import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Shield, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/features/learn/data/apiClient";

type AdminUser = {
  id: number;
  email: string;
  displayName: string;
  role: "user" | "admin";
  createdAt: number;
  lastActiveAt: number;
  xp: number;
  level: number;
  dailyStreak: number;
};

type UserStats = {
  userId: number;
  progress: {
    totalItems: number;
    totalReviews: number;
    totalCorrect: number;
    avgMastery: number;
  };
  lessons: Record<string, number>;
};

export function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<AdminUser[]>("/api/v1/admin/users")
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q) ||
        u.role.includes(q),
    );
  }, [users, search]);

  const handleRoleChange = useCallback((userId: number, newRole: "user" | "admin") => {
    api
      .put(`/api/v1/admin/users/${userId}/role`, { role: newRole })
      .then(() => {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to update role"));
  }, []);

  if (loading) {
    return <p className="text-sm text-hanji-500">Loading users...</p>;
  }

  if (error) {
    return <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-namsaek-900 dark:text-hanji-100">Admin</h1>
        <p className="mt-1 text-sm text-hanji-500 dark:text-hanji-400">
          {users.length} registered {users.length === 1 ? "user" : "users"}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hanji-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-hanji-300 bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200 dark:focus:border-namsaek-500 sm:w-80"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((user) => (
          <UserRow key={user.id} user={user} onRoleChange={handleRoleChange} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-hanji-500 dark:text-hanji-400">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}

function UserRow({
  user,
  onRoleChange,
}: {
  user: AdminUser;
  onRoleChange: (id: number, role: "user" | "admin") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  function toggleExpand() {
    setExpanded((v) => !v);
    if (!expanded && !stats) {
      setStatsLoading(true);
      api
        .get<UserStats>(`/api/v1/admin/users/${user.id}/stats`)
        .then(setStats)
        .catch(() => {})
        .finally(() => setStatsLoading(false));
    }
  }

  return (
    <div className="rounded-2xl border border-hanji-300 bg-white dark:border-namsaek-700 dark:bg-namsaek-900">
      <button
        onClick={toggleExpand}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-namsaek-900 dark:text-hanji-100">
              {user.displayName}
            </span>
            {user.role === "admin" && (
              <ShieldCheck className="h-4 w-4 shrink-0 text-namsaek-500 dark:text-namsaek-400" />
            )}
          </div>
          <div className="truncate text-xs text-hanji-500 dark:text-hanji-400">{user.email}</div>
        </div>
        <div className="hidden items-center gap-4 text-xs text-hanji-600 dark:text-hanji-400 sm:flex">
          <span>Lv {user.level}</span>
          <span>{user.xp} XP</span>
          <span>{user.dailyStreak}d streak</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-hanji-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-hanji-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-hanji-200 px-5 py-4 dark:border-namsaek-700">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <Row label="Email" value={user.email} />
              <Row label="Role" value={user.role} />
              <Row label="Joined" value={formatDate(user.createdAt)} />
              <Row label="Last active" value={formatDate(user.lastActiveAt)} />
            </div>

            {statsLoading && (
              <p className="text-xs text-hanji-500">Loading stats...</p>
            )}
            {stats && (
              <div className="space-y-2 text-sm">
                <Row label="Items studied" value={String(stats.progress.totalItems)} />
                <Row label="Total reviews" value={String(stats.progress.totalReviews)} />
                <Row
                  label="Accuracy"
                  value={
                    stats.progress.totalReviews > 0
                      ? `${Math.round((stats.progress.totalCorrect / stats.progress.totalReviews) * 100)}%`
                      : "—"
                  }
                />
                <Row label="Avg mastery" value={`${Math.round(stats.progress.avgMastery * 100)}%`} />
                {Object.keys(stats.lessons).length > 0 && (
                  <Row
                    label="Lessons"
                    value={Object.entries(stats.lessons)
                      .map(([status, count]) => `${count} ${status.replace("_", " ")}`)
                      .join(", ")}
                  />
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-hanji-500" />
            <select
              value={user.role}
              onChange={(e) => onRoleChange(user.id, e.target.value as "user" | "admin")}
              className="rounded-lg border border-hanji-300 bg-hanji-50 px-2 py-1 text-sm outline-none dark:border-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-hanji-500 dark:text-hanji-400">{label}</span>
      <span className="font-medium text-namsaek-800 dark:text-hanji-200">{value}</span>
    </div>
  );
}

function formatDate(ts: number): string {
  if (!ts) return "—";
  // Backend stores unix seconds, not milliseconds
  const ms = ts < 1e12 ? ts * 1000 : ts;
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
