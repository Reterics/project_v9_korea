import { useState, type FormEvent } from "react";
import { KeyRound, Trash2, UserPen, Sun, Moon } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { validatePassword } from "@/features/auth/authTypes";
import { IS_LIVE } from "@/features/learn/data/types";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-namsaek-900 dark:text-hanji-100">
        Settings
      </h1>
      {IS_LIVE && <DisplayNameSection />}
      <ThemeSection />
      {IS_LIVE && <ChangePasswordSection />}
      <ClearDataSection />
    </div>
  );
}

function DisplayNameSection() {
  const { auth, changeDisplayName } = useAuth();
  const currentName = auth.status === "authenticated" ? auth.user.displayName : "";
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const changed = name.trim() !== currentName;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await changeDisplayName(name);
      setSuccess("Display name updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update name");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader icon={<UserPen className="h-5 w-5" />} title="Display Name" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Display name"
          type="text"
          value={name}
          onChange={setName}
          autoComplete="name"
        />
        {error && <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>}
        {success && <p className="text-sm text-cheongja-600 dark:text-cheongja-400">{success}</p>}
        <button
          type="submit"
          disabled={loading || !changed || !name.trim()}
          className="rounded-xl bg-namsaek-600 px-4 py-2 text-sm font-medium text-white hover:bg-namsaek-700 disabled:opacity-50 dark:bg-namsaek-500 dark:hover:bg-namsaek-400"
        >
          {loading ? "Saving..." : "Update Name"}
        </button>
      </form>
    </Card>
  );
}

function ThemeSection() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  function toggle(value: boolean) {
    setDark(value);
    const root = document.documentElement;
    root.classList.toggle("dark", value);
    localStorage.setItem("theme", value ? "dark" : "light");
  }

  return (
    <Card>
      <CardHeader
        icon={dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        title="Theme"
      />
      <div className="flex gap-3">
        <button
          onClick={() => toggle(false)}
          className={
            "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition " +
            (!dark
              ? "border-namsaek-500 bg-namsaek-50 text-namsaek-700 dark:border-namsaek-400 dark:bg-namsaek-800 dark:text-hanji-100"
              : "border-hanji-300 text-hanji-600 hover:bg-hanji-50 dark:border-namsaek-700 dark:text-hanji-400 dark:hover:bg-namsaek-800")
          }
        >
          <Sun className="h-4 w-4" /> Light
        </button>
        <button
          onClick={() => toggle(true)}
          className={
            "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition " +
            (dark
              ? "border-namsaek-500 bg-namsaek-50 text-namsaek-700 dark:border-namsaek-400 dark:bg-namsaek-800 dark:text-hanji-100"
              : "border-hanji-300 text-hanji-600 hover:bg-hanji-50 dark:border-namsaek-700 dark:text-hanji-400 dark:hover:bg-namsaek-800")
          }
        >
          <Moon className="h-4 w-4" /> Dark
        </button>
      </div>
    </Card>
  );
}

function ChangePasswordSection() {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validation = validatePassword(newPw);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await changePassword(current, newPw, confirm);
      setSuccess("Password changed successfully.");
      setCurrent("");
      setNewPw("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader icon={<KeyRound className="h-5 w-5" />} title="Change Password" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Current password"
          type="password"
          value={current}
          onChange={setCurrent}
          autoComplete="current-password"
        />
        <InputField
          label="New password"
          type="password"
          value={newPw}
          onChange={setNewPw}
          autoComplete="new-password"
        />
        {newPw && (
          <ul className="space-y-1 text-xs">
            <Requirement met={validation.minLength}>At least 8 characters</Requirement>
            <Requirement met={validation.hasLetter}>Contains a letter</Requirement>
            <Requirement met={validation.hasDigit}>Contains a digit</Requirement>
          </ul>
        )}
        <InputField
          label="Confirm new password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />
        {error && <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>}
        {success && <p className="text-sm text-cheongja-600 dark:text-cheongja-400">{success}</p>}
        <button
          type="submit"
          disabled={loading || !current || !validation.valid || !confirm}
          className="rounded-xl bg-namsaek-600 px-4 py-2 text-sm font-medium text-white hover:bg-namsaek-700 disabled:opacity-50 dark:bg-namsaek-500 dark:hover:bg-namsaek-400"
        >
          {loading ? "Saving..." : "Change Password"}
        </button>
      </form>
    </Card>
  );
}

function ClearDataSection() {
  const [confirmed, setConfirmed] = useState(false);

  function handleClear() {
    localStorage.removeItem("korean_mastery");
    localStorage.removeItem("korean_progress");
    localStorage.removeItem("korean_profile");
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 3000);
  }

  return (
    <Card>
      <CardHeader icon={<Trash2 className="h-5 w-5" />} title="Clear Local Data" />
      <p className="mb-4 text-sm text-hanji-600 dark:text-hanji-400">
        Remove all locally stored progress, mastery scores, and profile data from this browser.
        This does not affect your server account.
      </p>
      {confirmed ? (
        <p className="text-sm text-cheongja-600 dark:text-cheongja-400">
          Local data cleared.
        </p>
      ) : (
        <button
          onClick={handleClear}
          className="rounded-xl border border-dancheong-300 px-4 py-2 text-sm font-medium text-dancheong-700 hover:bg-dancheong-50 dark:border-dancheong-700 dark:text-dancheong-400 dark:hover:bg-dancheong-950"
        >
          Clear All Local Data
        </button>
      )}
    </Card>
  );
}

/* ---- Shared UI ---- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-hanji-300 bg-white p-5 dark:border-namsaek-700 dark:bg-namsaek-900">
      {children}
    </div>
  );
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-namsaek-800 dark:text-hanji-200">
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

function InputField({
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-hanji-700 dark:text-hanji-300">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-hanji-300 bg-hanji-50 px-3 py-2 text-sm text-namsaek-900 outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-100 dark:focus:border-namsaek-400"
      />
    </label>
  );
}

function Requirement({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <li className={met ? "text-cheongja-600 dark:text-cheongja-400" : "text-hanji-500 dark:text-hanji-500"}>
      {met ? "✓" : "○"} {children}
    </li>
  );
}
