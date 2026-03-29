import { useState, type FormEvent } from "react";
import { KeyRound, Trash2, UserPen, Sun, Moon } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { validatePassword } from "@/features/auth/authTypes";
import { IS_LIVE } from "@/features/learn/data/types";
import { Button, Card, CardHeader, FormField, Input, PageHeader } from "@reterics/birdie-ui";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" />
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
    <Card variant="section">
      <CardHeader icon={<UserPen className="h-5 w-5" />} title="Display Name" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Display name" htmlFor="display-name">
          <Input
            id="display-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </FormField>
        {error && <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>}
        {success && <p className="text-sm text-cheongja-600 dark:text-cheongja-400">{success}</p>}
        <Button
          type="submit"
          size="sm"
          disabled={loading || !changed || !name.trim()}
        >
          {loading ? "Saving..." : "Update Name"}
        </Button>
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
    <Card variant="section">
      <CardHeader
        icon={dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        title="Theme"
      />
      <div className="flex gap-3">
        <Button
          variant={!dark ? "nav-active" : "nav-inactive"}
          size="sm"
          onClick={() => toggle(false)}
        >
          <Sun className="h-4 w-4" /> Light
        </Button>
        <Button
          variant={dark ? "nav-active" : "nav-inactive"}
          size="sm"
          onClick={() => toggle(true)}
        >
          <Moon className="h-4 w-4" /> Dark
        </Button>
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
    <Card variant="section">
      <CardHeader icon={<KeyRound className="h-5 w-5" />} title="Change Password" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Current password" htmlFor="current-password">
          <Input
            id="current-password"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
          />
        </FormField>
        <FormField label="New password" htmlFor="new-password">
          <Input
            id="new-password"
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            autoComplete="new-password"
          />
        </FormField>
        {newPw && (
          <ul className="space-y-1 text-xs">
            <Requirement met={validation.minLength}>At least 8 characters</Requirement>
            <Requirement met={validation.hasLetter}>Contains a letter</Requirement>
            <Requirement met={validation.hasDigit}>Contains a digit</Requirement>
          </ul>
        )}
        <FormField label="Confirm new password" htmlFor="confirm-password">
          <Input
            id="confirm-password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </FormField>
        {error && <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>}
        {success && <p className="text-sm text-cheongja-600 dark:text-cheongja-400">{success}</p>}
        <Button
          type="submit"
          size="sm"
          disabled={loading || !current || !validation.valid || !confirm}
        >
          {loading ? "Saving..." : "Change Password"}
        </Button>
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
    <Card variant="section">
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
        <Button variant="danger" size="sm" onClick={handleClear}>
          Clear All Local Data
        </Button>
      )}
    </Card>
  );
}

function Requirement({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <li className={met ? "text-cheongja-600 dark:text-cheongja-400" : "text-hanji-500 dark:text-hanji-500"}>
      {met ? "✓" : "○"} {children}
    </li>
  );
}
