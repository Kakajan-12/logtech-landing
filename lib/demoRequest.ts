export const DEMO_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "position",
  "company",
] as const;
export type DemoField = (typeof DEMO_FIELDS)[number];
export type DemoRequest = Record<DemoField, string>;
export type DemoFieldError = "required" | "invalid" | "tooLong";

export type DemoState =
  | { status: "idle" }
  | { status: "ok" }
  | {
      status: "error";
      /** per-field error codes, translated on the client */
      fields?: Partial<Record<DemoField, DemoFieldError>>;
      values?: Partial<DemoRequest>;
      /** "send" when the email could not be delivered */
      reason?: "send";
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const MAX_LENGTH = 120;

export function validateDemoRequest(values: DemoRequest) {
  const fields: Partial<Record<DemoField, DemoFieldError>> = {};
  for (const f of DEMO_FIELDS) {
    if (!values[f]) fields[f] = "required";
    else if (values[f].length > MAX_LENGTH) fields[f] = "tooLong";
  }
  if (!fields.email && !EMAIL_RE.test(values.email)) fields.email = "invalid";
  if (!fields.phone && !PHONE_RE.test(values.phone)) fields.phone = "invalid";
  return fields;
}
