export type AuthUser = {
  id: number;
  email: string;
  displayName: string;
  role: "user" | "admin";
};

export type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: AuthUser };

export type PasswordValidation = {
  minLength: boolean;
  hasLetter: boolean;
  hasDigit: boolean;
  valid: boolean;
};

export function validatePassword(password: string): PasswordValidation {
  const minLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  return {
    minLength,
    hasLetter,
    hasDigit,
    valid: minLength && hasLetter && hasDigit,
  };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
