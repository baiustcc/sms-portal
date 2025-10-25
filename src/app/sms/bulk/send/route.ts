import { NextResponse } from "next/server";
import { renderTemplate, buildMessage, sendBulkSms } from "@/lib/sms";

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
  const messages = normalized
    .map((row: Record<string, unknown>) => ({
      to: String((row as any)[phoneKey ?? "number"] ?? ""),
      message: buildMessage(renderTemplate(template, row), footerOverride),
    }))
    .filter((m: { to: string }) => m.to);
  const result = await sendBulkSms(messages);
  return NextResponse.json(result);
}
