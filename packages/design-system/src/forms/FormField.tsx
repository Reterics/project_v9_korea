import type { ReactNode } from "react";
import { Label } from "./Label.tsx";
import { HelperText } from "./HelperText.tsx";
import { FieldError } from "./FieldError.tsx";

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  required,
  error,
  helperText,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={"flex flex-col gap-1.5" + (className ? " " + className : "")}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? <FieldError>{error}</FieldError> : helperText ? <HelperText>{helperText}</HelperText> : null}
    </div>
  );
}
