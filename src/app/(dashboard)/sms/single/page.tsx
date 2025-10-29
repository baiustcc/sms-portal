"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const schema = z.object({
  number: z.string().min(10),
  message: z.string().min(1),
  footerOverride: z.string().optional(),
});

export default function SingleSendPage() {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [footerOverride, setFooterOverride] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const canPreview = useMemo(
    () => schema.safeParse({ number, message, footerOverride }).success,
    [number, message, footerOverride]
  );

  const handlePreview = async () => {
    if (!canPreview) {
      toast.error("Please fill number and message");
      return;
    }
    const res = await fetch("/sms/single/preview", {
      method: "POST",
      body: JSON.stringify({ number, message, footerOverride: footerOverride || undefined }),
    });
    if (!res.ok) {
      toast.error("Preview failed");
      return;
    }
    const data = await res.json();
    setPreview(data.preview);
  };

  const handleSend = async () => {
    if (!preview) {
      toast.error("Generate preview first");
      return;
    }
    setSending(true);
    const res = await fetch("/sms/single/send", {
      method: "POST",
      body: JSON.stringify({ number, message, footerOverride: footerOverride || undefined }),
    });
    setSending(false);
    if (!res.ok) {
      toast.error("Send failed");
      return;
    }
    toast.success("Message sent");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Single Send</h1>
      <Card>
        <CardHeader>
          <CardTitle>Compose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Recipient Number</Label>
            <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="8801XXXXXXXXX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footer">Footer override (optional)</Label>
            <Input
              id="footer"
              value={footerOverride}
              onChange={(e) => setFooterOverride(e.target.value)}
              placeholder="- BAIUST Computer Club"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={handlePreview} disabled={!canPreview}>
              Preview
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSend}
              disabled={!preview || sending}
              aria-busy={sending}
            >
              Send
            </Button>
          </div>
          {preview && (
            <div
              className="rounded-md border p-3 text-sm whitespace-pre-wrap"
              aria-label="Message preview"
              role="region"
              tabIndex={0}
            >
              {preview}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}







