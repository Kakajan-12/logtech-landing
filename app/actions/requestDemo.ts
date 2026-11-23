"use server";

import { sendDemoRequest } from "@/lib/demoEmail";
import {
  DEMO_FIELDS,
  validateDemoRequest,
  type DemoRequest,
  type DemoState,
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
    await sendDemoRequest(values);
    return { status: "ok" };
  } catch (err) {
    console.error("[requestDemo] email failed", err);
    return { status: "error", reason: "send", values };
  }
}
