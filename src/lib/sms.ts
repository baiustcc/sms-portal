import Handlebars from "handlebars";

type SinglePayload = {
  number: string;
  message: string;
  footerOverride?: string;
};

type BulkItem = { to: string; message: string };

export const DEFAULT_FOOTER = process.env.DEFAULT_SMS_FOOTER ?? "- BAIUST Computer Club";

const getCreds = () => {
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID;
  if (!apiKey || !senderId) throw new Error("Missing SMS_API_KEY or SMS_SENDER_ID env");
  return { apiKey, senderId };
};

export const renderTemplate = (template: string, data: Record<string, unknown>): string => {
  const compiled = Handlebars.compile(template, { noEscape: true });
  return compiled(data);
};

export const buildMessage = (content: string, footerOverride?: string) => {
  const footer = footerOverride ?? DEFAULT_FOOTER;
  if (!footer) return content;
  return `${content}\n${footer}`;
};

export const sendSingleSms = async ({ number, message, footerOverride }: SinglePayload) => {
  const { apiKey, senderId } = getCreds();
  const finalMessage = buildMessage(message, footerOverride);
  const res = await fetch("http://bulksmsbd.net/api/smsapi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, senderid: senderId, number, message: finalMessage }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Single SMS failed: ${res.status} ${text}`);
  }
  return res.json();
};

export const sendBulkSms = async (items: BulkItem[]) => {
  const { apiKey, senderId } = getCreds();
  const res = await fetch("http://bulksmsbd.net/api/smsapimany", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, senderid: senderId, messages: items }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bulk SMS failed: ${res.status} ${text}`);
  }
  return res.json();
};

export type SmsBalanceResponse = { response_code: number; balance: number };

export const getSmsBalance = async (): Promise<SmsBalanceResponse> => {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) throw new Error("Missing SMS_API_KEY env");
  const url = `http://bulksmsbd.net/api/getBalanceApi?api_key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Balance fetch failed: ${res.status} ${text}`);
  }
  return res.json();
};
