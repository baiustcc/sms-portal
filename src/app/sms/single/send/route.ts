import { NextResponse } from "next/server";
import { sendSingleSms } from "@/lib/sms";

export async function POST(req: Request) {
  const { number, message, footerOverride } = await req.json();
  const result = await sendSingleSms({ number, message, footerOverride });
  return NextResponse.json(result);
}






