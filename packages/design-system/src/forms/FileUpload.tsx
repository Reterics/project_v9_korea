import { useEffect, useId, useMemo, useState } from "react";
import type { DragEvent, InputHTMLAttributes } from "react";
import { ImagePlus, X } from "lucide-react";

export type FileUploadError = {
  fileName: string;
  message: string;
};

type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "accept" | "onChange" | "value"> & {
  label?: string;
  accept?: string[];
  maxFiles?: number;
  maxSizeBytes?: number;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  onValidationError?: (errors: FileUploadError[]) => void;
};

const imageAccept = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function matchesAccept(file: File, accept: string[]) {
  return accept.some((pattern) => {
    if (pattern.endsWith("/*")) return file.type.startsWith(pattern.slice(0, -1));
    return file.type === pattern || file.name.toLowerCase().endsWith(pattern.toLowerCase());
  });
}

export function FileUpload({
  label = "Upload images",
  accept = imageAccept,
  maxFiles = 5,
  maxSizeBytes = 5 * 1024 * 1024,
  files,
  onFilesChange,
  onValidationError,
  disabled,
  multiple = true,
  className = "",
  id,
  ...rest
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<FileUploadError[]>([]);
  const selectedFiles = files ?? internalFiles;

  const previews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  const commitFiles = (nextFiles: File[]) => {
    if (!files) setInternalFiles(nextFiles);
    onFilesChange?.(nextFiles);
  };

  const validateAndAdd = (incoming: File[]) => {
    const validationErrors: FileUploadError[] = [];
    const availableSlots = Math.max(0, maxFiles - selectedFiles.length);
    const candidates = multiple ? incoming.slice(0, availableSlots) : incoming.slice(0, 1);

    if (incoming.length > candidates.length) {
      validationErrors.push({
        fileName: "Selection",
        message: `You can upload up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`,
      });
    }

    const validFiles = candidates.filter((file) => {
      if (!matchesAccept(file, accept)) {
        validationErrors.push({ fileName: file.name, message: "Unsupported image format." });
        return false;
      }
      if (file.size > maxSizeBytes) {
        validationErrors.push({
          fileName: file.name,
          message: `File must be ${formatBytes(maxSizeBytes)} or smaller.`,
        });
        return false;
      }
      return true;
    });

    const nextFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
    if (validFiles.length) commitFiles(nextFiles);
    setErrors(validationErrors);
    if (validationErrors.length) onValidationError?.(validationErrors);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (disabled) return;
    validateAndAdd(Array.from(event.dataTransfer.files));
  };

  const removeFile = (file: File) => {
    commitFiles(selectedFiles.filter((selected) => selected !== file));
  };

  return (
    <div className={"flex w-full flex-col gap-3" + (className ? " " + className : "")}>
      <label
        htmlFor={inputId}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={
          "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition " +
          (dragActive
            ? "border-namsaek-500 bg-namsaek-50 dark:border-namsaek-300 dark:bg-namsaek-900"
            : "border-hanji-300 bg-white hover:border-namsaek-300 hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-900 dark:hover:border-namsaek-500") +
          (disabled ? " cursor-not-allowed opacity-50" : "")
        }
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-namsaek-100 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-100">
          <ImagePlus className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-namsaek-700 dark:text-hanji-100">{label}</span>
        <span className="text-xs text-hanji-600 dark:text-hanji-400">
          Drag and drop or browse. {formatBytes(maxSizeBytes)} max per image.
        </span>
        <input
          id={inputId}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            validateAndAdd(Array.from(event.currentTarget.files ?? []));
            event.currentTarget.value = "";
          }}
          className="sr-only"
          {...rest}
        />
      </label>

      {errors.length > 0 && (
        <div className="rounded-xl border border-dancheong-200 bg-dancheong-50 px-3 py-2 text-xs text-dancheong-700 dark:border-dancheong-700 dark:bg-dancheong-900/50 dark:text-dancheong-200">
          {errors.map((error) => (
            <div key={`${error.fileName}-${error.message}`}>
              <strong>{error.fileName}:</strong> {error.message}
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((preview) => (
            <div
              key={`${preview.file.name}-${preview.file.lastModified}`}
              className="group relative overflow-hidden rounded-xl border border-hanji-300 bg-white shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900"
            >
              <img src={preview.url} alt={preview.file.name} className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(preview.file)}
                className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-namsaek-700 shadow-sm transition hover:bg-dancheong-50 hover:text-dancheong-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-namsaek-300 dark:bg-namsaek-900/90 dark:text-hanji-100"
                aria-label={`Remove ${preview.file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="px-3 py-2">
                <div className="truncate text-xs font-semibold text-namsaek-700 dark:text-hanji-100">
                  {preview.file.name}
                </div>
                <div className="text-xs text-hanji-600 dark:text-hanji-400">{formatBytes(preview.file.size)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
