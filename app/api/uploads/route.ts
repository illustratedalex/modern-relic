import type { HandleUploadBody } from "@vercel/blob/client";
import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import {
  ALLOWED_ARTWORK_MIME_TYPES,
  BLOB_UPLOAD_PREFIX,
  MAX_ARTWORK_FILE_SIZE_BYTES,
  getFileExtension,
  isAllowedArtworkType,
  sanitizeFilename,
} from "@/lib/custom-tumbler";

export const runtime = "nodejs";

function parseClientPayload(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.filename === "string" &&
      typeof parsed.contentType === "string"
    ) {
      return parsed as { filename: string; contentType: string };
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob storage is not configured." }, { status: 500 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid upload request payload." }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith(`${BLOB_UPLOAD_PREFIX}/`)) {
          throw new Error("Invalid upload destination.");
        }

        const pathFilename = pathname.split("/").pop() ?? "";
        const parsedPayload = parseClientPayload(clientPayload);
        const payloadFilename = parsedPayload?.filename ?? pathFilename;
        const contentType = parsedPayload?.contentType ?? "";
        const sanitizedFilename = sanitizeFilename(payloadFilename);

        if (!sanitizedFilename || pathFilename !== sanitizedFilename) {
          throw new Error("Filename must be sanitized before upload.");
        }

        const extension = getFileExtension(sanitizedFilename);
        if (!extension || !isAllowedArtworkType(sanitizedFilename, contentType)) {
          throw new Error("Unsupported file type. Allowed: JPG, JPEG, PNG, PDF, SVG, WEBP.");
        }

        return {
          allowedContentTypes: [...ALLOWED_ARTWORK_MIME_TYPES],
          maximumSizeInBytes: MAX_ARTWORK_FILE_SIZE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        return;
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload token generation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
