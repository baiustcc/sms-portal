"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  fileLoaded: z.boolean(),
  template: z.string().min(1),
});

type RowData = Record<string, unknown>;

export default function BulkSendPage() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [template, setTemplate] = useState("");
  const [footerOverride, setFooterOverride] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [phoneKey, setPhoneKey] = useState<string | undefined>(undefined);
  const [expanded, setExpanded] = useState(false);
  const headers = useMemo(() => (rows[0] ? Object.keys(rows[0]) : []), [rows]);
  const displayRows = useMemo(() => (expanded ? rows : rows.slice(0, 3)), [expanded, rows]);

  const canPreview = useMemo(
    () => schema.safeParse({ fileLoaded: rows.length > 0, template }).success,
    [rows.length, template]
  );

  const normalizeKey = (key: string) =>
    key
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_");

  const normalizeRow = (row: RowData): RowData => {
    const out: RowData = {};
    Object.keys(row).forEach((k) => {
      const nk = normalizeKey(k);
      out[nk] = (row as any)[k];
    });
    return out;
  };

  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<RowData>(sheet, {
      raw: false,
      defval: "",
      blankrows: false,
    });
    const normalized = json.map(normalizeRow);
    setRows(normalized);
    const hs = normalized[0] ? Object.keys(normalized[0]) : [];
    const guesses = ["phone_number", "number", "phone", "mobile", "msisdn", "recipient", "to", "contact", "cell"];
    const found = guesses.find((g) => hs.includes(g));
    setPhoneKey(found);
  };

  const handlePreview = async () => {
    if (!canPreview) {
      toast.error("Upload Excel and write a template");
      return;
    }
    const res = await fetch("/sms/bulk/preview", {
      method: "POST",
      body: JSON.stringify({ rows, template, footerOverride: footerOverride || undefined, phoneKey }),
    });
    if (!res.ok) {
      toast.error("Preview failed");
      return;
    }
    const data = await res.json();
    if (Array.isArray(data.items)) {
      setPreviews(data.items.map((i: any) => `To: ${i.to}\n${i.message}`));
    } else if (Array.isArray(data.previews)) {
      setPreviews(data.previews);
    } else {
      setPreviews([]);
    }
  };

  const handleSend = async () => {
    if (previews.length === 0) {
      toast.error("Generate preview first");
      return;
    }
    if (!phoneKey) {
      toast.error("Select a recipient column (phone_number)");
      return;
    }
    setSending(true);
    const res = await fetch("/sms/bulk/send", {
      method: "POST",
      body: JSON.stringify({ rows, template, footerOverride: footerOverride || undefined, phoneKey }),
    });
    setSending(false);
    if (!res.ok) {
      toast.error("Send failed");
      return;
    }
    toast.success("Bulk messages sent");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Bulk Send</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload & Compose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Excel (.xlsx)</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />
            <p className="text-xs text-muted-foreground">
              First row headers become variables. Select the recipient phone column below.
            </p>
          </div>
          {headers.length > 0 && (
            <div className="space-y-2">
              <Label>Recipient column</Label>
              <div className="flex items-center gap-3">
                <Select value={phoneKey} onValueChange={(v) => setPhoneKey(v)}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select phone column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!phoneKey && (
                  <span className="text-xs text-red-600" role="alert">
                    Select a phone_number column to enable sending.
                  </span>
                )}
              </div>
            </div>
          )}
          {headers.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-medium">Detected Variables</h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {headers.map((h) => (
                  <code key={h} className="rounded bg-muted px-2 py-1">{`{{${h}}}`}</code>
                ))}
              </div>
              <div className="relative overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayRows.map((r, idx) => (
                      <TableRow key={idx}>
                        {headers.map((h) => (
                          <TableCell key={h}>{String((r as any)[h] ?? "")}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!expanded && rows.length > 3 && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent rounded-b-md" />
                )}
              </div>
              {rows.length > 3 && (
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setExpanded((v) => !v)}>
                    {expanded ? "Collapse" : "View all rows"}
                  </Button>
                  {!expanded && <span className="text-xs text-muted-foreground">and {rows.length - 3} more…</span>}
                </div>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="template">Message Template (Handlebars)</Label>
            <Textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={8}
              placeholder="Hello {{name}}\n{{#if is_member}}See you at the meetup{{else}}Join us!{{/if}}"
            />
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
              disabled={previews.length === 0 || sending || !phoneKey}
              aria-busy={sending}
            >
              Send
            </Button>
          </div>
          {previews.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-medium">Preview ({previews.length})</h2>
              <div className="grid gap-2 md:grid-cols-2 max-h-[50vh] overflow-auto pr-2">
                {previews.map((p, idx) => (
                  <div key={idx} className="rounded-md border p-3 text-sm whitespace-pre-wrap">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
