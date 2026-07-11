"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  BLOB_UPLOAD_PREFIX,
  MAX_ARTWORK_FILE_COUNT,
  sanitizeFilename,
  validateArtworkFile,
} from "@/lib/custom-tumbler";

type UploadedArtworkPayload = {
  originalName: string;
  sanitizedName: string;
  url: string;
};

export function CustomTumblerArtworkForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData(event.currentTarget);
      const customerName = String(formData.get("customer_name") ?? "").trim();
      const email = String(formData.get("customer_email") ?? "").trim();
      const phone = String(formData.get("customer_phone") ?? "").trim();
      const quantity = Number(formData.get("quantity"));
      const personalizationText = String(formData.get("personalization_text") ?? "").trim();
      const colorPreferences = String(formData.get("color_preferences") ?? "").trim();
      const printingPreference = String(formData.get("printing_preference") ?? "").trim();
      const designServiceOption = String(formData.get("design_service_option") ?? "").trim();
      const designNotes = String(formData.get("design_notes") ?? "").trim();
      const copyrightAccepted = formData.get("copyright_permission") === "on";

      const rawFiles = formData.getAll("artwork_files");
      const files = rawFiles.filter((file): file is File => file instanceof File && file.size > 0);

      if (!customerName || !email || !phone || !quantity || quantity < 1 || !printingPreference || !designServiceOption) {
        throw new Error("Please complete all required fields.");
      }

      if (!copyrightAccepted) {
        throw new Error("You must confirm copyright permission before submitting.");
      }

      if (!files.length) {
        throw new Error("Please upload at least one artwork file.");
      }

      if (files.length > MAX_ARTWORK_FILE_COUNT) {
        throw new Error(`You can upload up to ${MAX_ARTWORK_FILE_COUNT} files.`);
      }

      for (const file of files) {
        const validationError = validateArtworkFile(file);
        if (validationError) {
          throw new Error(`${file.name}: ${validationError}`);
        }
      }

      const uploadedFiles: UploadedArtworkPayload[] = [];
      for (const file of files) {
        const sanitizedName = sanitizeFilename(file.name);
        const pathname = `${BLOB_UPLOAD_PREFIX}/${Date.now()}-${sanitizedName}`;

        const blob = await upload(pathname, file, {
          access: "private",
          handleUploadUrl: "/api/uploads",
          contentType: file.type,
          clientPayload: JSON.stringify({ filename: sanitizedName, contentType: file.type }),
        });

        uploadedFiles.push({
          originalName: file.name,
          sanitizedName,
          url: blob.url,
        });
      }

      const response = await fetch("/api/shop/custom-tumbler/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          quantity,
          personalizationText,
          colorPreferences,
          printingPreference,
          designServiceOption,
          designNotes,
          uploadedFiles,
          copyrightPermissionAccepted: true,
        }),
      });

      const result = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok || !result.reference) {
        throw new Error(result.error ?? "Could not submit your tumbler request.");
      }

      router.push(`/shop/custom-tumbler/confirmation?reference=${encodeURIComponent(result.reference)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Submission failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label htmlFor="customer_name">Customer Name</label>
      <input id="customer_name" name="customer_name" type="text" required />

      <label htmlFor="customer_email">Email</label>
      <input id="customer_email" name="customer_email" type="email" required />

      <label htmlFor="customer_phone">Phone</label>
      <input id="customer_phone" name="customer_phone" type="tel" required />

      <label htmlFor="quantity">Quantity</label>
      <input id="quantity" name="quantity" type="number" min={1} max={1000} defaultValue={1} required />

      <label htmlFor="personalization_text">Personalization Text</label>
      <input id="personalization_text" name="personalization_text" type="text" />

      <label htmlFor="color_preferences">Color Preferences</label>
      <input id="color_preferences" name="color_preferences" type="text" />

      <label htmlFor="printing_preference">Printing Preference</label>
      <select id="printing_preference" name="printing_preference" required defaultValue="sublimation">
        <option value="sublimation">Sublimation</option>
        <option value="uv">UV Printing</option>
      </select>

      <label htmlFor="design_service_option">Design Service Option</label>
      <select id="design_service_option" name="design_service_option" required defaultValue="design-ready">
        <option value="design-ready">Artwork ready to print</option>
        <option value="need-design-help">Need light design help</option>
        <option value="full-design-service">Need full design service</option>
      </select>

      <label htmlFor="design_notes">Design Notes</label>
      <textarea id="design_notes" name="design_notes" rows={6} />

      <label htmlFor="artwork_files">Artwork Files (JPG, JPEG, PNG, PDF, SVG, WEBP)</label>
      <input
        id="artwork_files"
        name="artwork_files"
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.pdf,.svg,.webp,image/jpeg,image/png,application/pdf,image/svg+xml,image/webp"
        required
      />

      <label className="mr-checkbox">
        <input id="copyright_permission" name="copyright_permission" type="checkbox" required />
        I confirm I own this artwork or have permission to use it for print production.
      </label>

      {errorMessage ? <p className="mr-form-error">{errorMessage}</p> : null}

      <button className="btn primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Uploading Artwork..." : "Upload Artwork & Customize"}
      </button>
    </form>
  );
}
