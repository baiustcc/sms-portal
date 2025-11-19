"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const phoneSchema = z.object({
  number: z.string().min(6, "Phone is required"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function SignInPage() {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"number" | "otp">("number");
  const [loading, setLoading] = useState(false);
  const [clientIp, setClientIp] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        if (!res.ok) throw new Error("Failed to fetch IP");
        const data = (await res.json()) as { ip?: string };
        if (!cancelled) setClientIp(data.ip ?? null);
      } catch (error) {
        console.error("Unable to determine client IP", error);
        if (!cancelled) setClientIp(null);
      }
    };
    fetchIp();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = phoneSchema.safeParse({ number });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid phone number");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, clientIp }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error ?? "Failed to send OTP");
      return;
    }
    toast.success("OTP sent to security contacts");
    setStep("otp");
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = otpSchema.safeParse({ otp });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid OTP");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, otp }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error ?? "Invalid OTP");
      return;
    }
    toast.success("Authenticated");
    router.replace("/dashboard");
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Secure Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "number" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number">Registered Phone Number</Label>
                <Input
                  id="number"
                  inputMode="tel"
                  value={number}
                  onChange={(event) => setNumber(event.target.value)}
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Requesting…" : "Request OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  maxLength={6}
                  placeholder="123456"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying…" : "Verify OTP"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("number")} disabled={loading}>
                Start over
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

