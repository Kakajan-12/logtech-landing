"use server";

import { sendDemoRequest } from "@/lib/demoEmail";
import {
  DEMO_FIELDS,
  REQUEST_KINDS,
  validateDemoRequest,
  type DemoRequest,
  type DemoState,
  type RequestKind,
} from "@/lib/demoRequest";

export async function requestDemo(
  _prev: DemoState,
  formData: FormData,
): Promise<DemoState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("website") ?? "").trim()) return { status: "ok" };

  const values = Object.fromEntries(
    DEMO_FIELDS.map((f) => [f, String(formData.get(f) ?? "").trim()]),
  ) as DemoRequest;

  const fields = validateDemoRequest(values);
  if (Object.keys(fields).length) return { status: "error", fields, values };

  try {
    const raw = String(formData.get("kind") ?? "");
    const kind: RequestKind = REQUEST_KINDS.includes(raw as RequestKind)
      ? (raw as RequestKind)
      : "demo";
    await sendDemoRequest(values, kind);
    return { status: "ok" };
  } catch (err) {
    console.error("[requestDemo] email failed", err);
    return { status: "error", reason: "send", values };
  }
}
