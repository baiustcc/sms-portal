import { NextResponse } from "next/server";
import { buildMessage, renderTemplate } from "@/lib/sms";

const normalizeKey = (key: string) =>
  key
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_");

const normalizeRow = (row: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  Object.keys(row).forEach((k) => {
    out[normalizeKey(k)] = (row as any)[k];
  });
  return out;
};

export async function POST(req: Request) {
  const { rows, template, footerOverride, phoneKey } = await req.json();
  const normalized = rows.map((r: Record<string, unknown>) => normalizeRow(r));
  const guesses = ["phone_number", "number", "phone", "mobile", "msisdn", "recipient", "to", "contact", "cell"];
  const resolveKey = (row: Record<string, unknown>) => {
    if (phoneKey && row[phoneKey] !== undefined) return phoneKey as string;
    return guesses.find((g) => row[g] !== undefined) || "";
  };

  const items = normalized.map((row: Record<string, unknown>) => {
    const key = resolveKey(row);
    const to = key ? String(row[key] ?? "") : "";
    const rendered = renderTemplate(template, row);
    const message = buildMessage(rendered, footerOverride);
    return { to, message };
  });

  return NextResponse.json({ items });
}
