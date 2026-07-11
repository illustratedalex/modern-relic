import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { customTumblerSubmissionSchema } from "@/lib/custom-tumbler";

export const runtime = "nodejs";

function createReferenceNumber(now: Date) {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `MR-${yy}${mm}${dd}-${suffix}`;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const parsed = customTumblerSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: issue?.message ?? "Submission data is invalid." }, { status: 400 });
  }

  const data = parsed.data;
  const pool = getDbPool();
  const uploadedFileNames = data.uploadedFiles.map((file) => file.sanitizedName);
  const uploadedBlobUrls = data.uploadedFiles.map((file) => file.url);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = createReferenceNumber(new Date());
    const result = await pool.query(
      `INSERT INTO custom_tumbler_submissions (
        reference_number,
        customer_name,
        email,
        phone,
        quantity,
        personalization_text,
        color_preferences,
        printing_preference,
        design_service_option,
        design_notes,
        uploaded_file_names,
        uploaded_blob_urls,
        copyright_permission_accepted,
        status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )
      ON CONFLICT (reference_number) DO NOTHING
      RETURNING reference_number`,
      [
        reference,
        data.customerName,
        data.email,
        data.phone,
        data.quantity,
        data.personalizationText,
        data.colorPreferences,
        data.printingPreference,
        data.designServiceOption,
        data.designNotes,
        uploadedFileNames,
        uploadedBlobUrls,
        data.copyrightPermissionAccepted,
        "new",
      ],
    );

    if (result.rowCount && result.rows[0]) {
      return NextResponse.json({ reference: result.rows[0].reference_number }, { status: 201 });
    }
  }

  return NextResponse.json(
    { error: "Could not create a unique reference number. Please try again." },
    { status: 500 },
  );
}
