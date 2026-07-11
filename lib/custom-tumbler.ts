import { z } from "zod";

export const MAX_ARTWORK_FILE_SIZE_BYTES = 15 * 1024 * 1024;
export const MAX_ARTWORK_FILE_COUNT = 6;
export const BLOB_UPLOAD_PREFIX = "modern-relic/custom-tumbler";

export const ALLOWED_ARTWORK_EXTENSIONS = ["jpg", "jpeg", "png", "pdf", "svg", "webp"] as const;
export const ALLOWED_ARTWORK_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/svg+xml",
  "image/webp",
] as const;

const EXECUTABLE_EXTENSIONS = new Set([
  "exe",
  "msi",
  "dll",
  "bat",
  "cmd",
  "sh",
  "ps1",
  "com",
  "scr",
  "jar",
  "php",
  "js",
  "mjs",
  "cjs",
  "ts",
  "tsx",
  "jsx",
  "py",
  "rb",
]);

const allowedExtensionsSet = new Set(ALLOWED_ARTWORK_EXTENSIONS);
const allowedMimeTypesSet = new Set(ALLOWED_ARTWORK_MIME_TYPES);

export function sanitizeFilename(filename: string) {
  const cleaned = filename
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "");

  return cleaned || "artwork-file";
}

export function getFileExtension(filename: string) {
  const index = filename.lastIndexOf(".");
  if (index < 0 || index === filename.length - 1) {
    return "";
  }
  return filename.slice(index + 1).toLowerCase();
}

export function isAllowedArtworkType(filename: string, mimeType: string) {
  const extension = getFileExtension(filename);
  if (!extension || EXECUTABLE_EXTENSIONS.has(extension)) {
    return false;
  }
  return allowedExtensionsSet.has(extension as (typeof ALLOWED_ARTWORK_EXTENSIONS)[number]) &&
    allowedMimeTypesSet.has(mimeType as (typeof ALLOWED_ARTWORK_MIME_TYPES)[number]);
}

export function validateArtworkFile(file: { name: string; size: number; type: string }) {
  if (!file.name) {
    return "Artwork file name is required.";
  }

  const sanitizedName = sanitizeFilename(file.name);
  if (!isAllowedArtworkType(sanitizedName, file.type)) {
    return "Unsupported file type. Allowed: JPG, JPEG, PNG, PDF, SVG, WEBP.";
  }

  if (file.size > MAX_ARTWORK_FILE_SIZE_BYTES) {
    return "File is too large. Maximum size is 15 MB per file.";
  }

  return null;
}

export const uploadedArtworkSchema = z.object({
  originalName: z.string().min(1),
  sanitizedName: z.string().min(1),
  url: z.string().url(),
});

export const customTumblerSubmissionSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required."),
  email: z.string().trim().email("Valid email is required."),
  phone: z.string().trim().min(1, "Phone is required."),
  quantity: z.coerce.number().int().min(1).max(1000),
  personalizationText: z.string().trim().default(""),
  colorPreferences: z.string().trim().default(""),
  printingPreference: z.enum(["sublimation", "uv"]),
  designServiceOption: z.enum(["design-ready", "need-design-help", "full-design-service"]),
  designNotes: z.string().trim().default(""),
  uploadedFiles: z.array(uploadedArtworkSchema).min(1).max(MAX_ARTWORK_FILE_COUNT),
  copyrightPermissionAccepted: z.literal(true),
});

export type CustomTumblerSubmissionInput = z.infer<typeof customTumblerSubmissionSchema>;
