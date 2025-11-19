import { NextResponse } from "next/server";
import { requestOtp } from "@/lib/otp";
import { normalizeNumber } from "@/lib/auth-config";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const rawNumber = typeof body.number === "string" ? body.number : "";
  const clientIp = typeof body.clientIp === "string" ? body.clientIp : null;
  const detectedIp = request.headers.get("x-forwarded-for") ?? (request as any).ip ?? null;
  const userAgent = request.headers.get("user-agent");

  try {
    const expiresAt = await requestOtp({ number: rawNumber, ip: detectedIp, clientIp, userAgent });
    return NextResponse.json({
      ok: true,
      number: normalizeNumber(rawNumber),
      expiresAt,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to request OTP" },
      { status: 403 }
    );
  }
}

