// Server-side only: imported from the requestDemo server action.
import type { DemoField, DemoRequest } from "./demoRequest";

export const DEMO_INBOX = "info@hebent.tech";

const LABELS: Record<DemoField, string> = {
  firstName: "Имя",
  lastName: "Фамилия",
  phone: "Телефон",
  email: "Почта",
  position: "Должность",
  company: "Компания",
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/**
 * Sends a demo request to DEMO_INBOX via Resend (Vercel Marketplace),
 * using its REST API directly: https://resend.com/docs/api-reference/emails/send-email
 */
export async function sendDemoRequest(request: DemoRequest): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const domain = process.env.RESEND_EMAIL_DOMAIN;
  if (!apiKey || !domain) throw new Error("RESEND_API_KEY / RESEND_EMAIL_DOMAIN not set");

  const rows = (Object.keys(LABELS) as DemoField[])
    .map(
      (f) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5d646d">${LABELS[f]}</td>` +
        `<td style="padding:6px 0;font-weight:600;color:#04331d">${escapeHtml(request[f])}</td></tr>`,
    )
    .join("");
  const text = (Object.keys(LABELS) as DemoField[])
    .map((f) => `${LABELS[f]}: ${request[f]}`)
    .join("\n");
  const name = `${request.firstName} ${request.lastName}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      from: `Hebent Fleet <noreply@${domain}>`,
      to: [DEMO_INBOX],
      // "Reply" in the inbox goes straight to the visitor
      reply_to: request.email,
      subject: `Заявка на демо: ${name}, ${request.company}`.replace(/\s+/g, " "),
      text: `Новая заявка на демо с сайта\n\n${text}`,
      html:
        `<div style="font-family:Arial,sans-serif;font-size:15px">` +
        `<h2 style="color:#0f833f;margin:0 0 16px">Новая заявка на демо</h2>` +
        `<table style="border-collapse:collapse">${rows}</table></div>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
