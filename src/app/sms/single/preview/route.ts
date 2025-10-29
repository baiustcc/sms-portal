import { NextResponse } from "next/server";
import { buildMessage } from "@/lib/sms";

export async function POST(req: Request) {
  const { message, footerOverride } = await req.json();
  const preview = buildMessage(message, footerOverride);
  return NextResponse.json({ preview });
}







