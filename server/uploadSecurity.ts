import { fileTypeFromBuffer } from "file-type";
import { TRPCError } from "@trpc/server";

const MIME_EXTENSIONS: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "application/pdf": ["pdf"],
  "video/mp4": ["mp4"],
  "video/quicktime": ["mov", "qt"],
  "video/webm": ["webm"],
  "application/msword": ["doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
  "application/vnd.ms-excel": ["xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
};

export function safeFileExtension(fileName: string, contentType: string): string {
  const expected = MIME_EXTENSIONS[contentType];
  if (!expected?.length) throw new TRPCError({ code: "BAD_REQUEST", message: "Unsupported file type." });
  const extension = fileName.toLowerCase().split(".").pop() ?? "";
  if (!expected.includes(extension)) throw new TRPCError({ code: "BAD_REQUEST", message: "The file extension does not match its declared type." });
  return expected[0];
}

export async function validateUpload(input: {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  maxBytes: number;
}) {
  if (input.buffer.byteLength > input.maxBytes) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: `File must be ${Math.round(input.maxBytes / 1024 / 1024)} MB or smaller.` });
  }
  const extension = safeFileExtension(input.fileName, input.contentType);
  const detected = await fileTypeFromBuffer(input.buffer);
  const strictTypes = input.contentType.startsWith("image/") || input.contentType === "application/pdf" || input.contentType.startsWith("video/");
  if (strictTypes && (!detected || (input.contentType === "image/jpeg" && detected.mime !== "image/jpeg") || (input.contentType === "image/png" && detected.mime !== "image/png") || (input.contentType === "image/webp" && detected.mime !== "image/webp") || (input.contentType === "application/pdf" && detected.mime !== "application/pdf") || (input.contentType.startsWith("video/") && !detected.mime.startsWith("video/")))) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "The file content does not match its declared type." });
  }
  return { extension, detectedMime: detected?.mime ?? input.contentType };
}
