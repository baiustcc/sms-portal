import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { normalizeNumber } from "@/lib/auth-config";
import { persistSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const rawNumber = typeof body.number === "string" ? body.number : "";
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";

  if (!otp) {
    return NextResponse.json({ ok: false, error: "OTP is required" }, { status: 400 });
  }

  const normalized = normalizeNumber(rawNumber);
  const isValid = verifyOtp(normalized, otp);
  if (!isValid) {
    return NextResponse.json({ ok: false, error: "Invalid or expired OTP" }, { status: 401 });
  }

  await persistSession(normalized);
  return NextResponse.json({ ok: true });
}

