import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { readSession } from "@/lib/session";
import { DEFAULT_FOOTER } from "@/lib/sms";
import { SignOutButton } from "@/components/auth/sign-out-button";

const portalFacts = [
  { label: "Access", value: "OTP-secured via AUTH_ALLOWED_NUMBERS" },
  { label: "SMS Footer", value: DEFAULT_FOOTER },
  { label: "Single Send", value: "/sms/single" },
  { label: "Bulk Send", value: "/sms/bulk" },
];

const mask = (value?: string) => {
  if (!value) return "-";
  return value.slice(-4).padStart(value.length, "•");
};

export default async function ProfilePage() {
  const session = await readSession();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Minimal metadata about your current authenticated session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Phone</TableCell>
                <TableCell>{mask(session?.number)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Session TTL</TableCell>
                <TableCell>12 hours (renew by re-authenticating)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Notes</CardTitle>
          <CardDescription>Review these controls whenever you rotate credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            OTP notifications include the requester&rsquo;s IP address, user agent, and timestamp. Ensure the numbers in
            <code> AUTH_ALLOWED_NUMBERS </code> and <code>AUTH_NOTIFICATION_NUMBERS</code> belong to administrators you
            trust.
          </p>
          <p>Revoke access instantly by removing a phone number from the environment and restarting the app.</p>
        </CardContent>
      </Card>

      <div className="max-w-sm">
        <SignOutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Reference targets that stay consistent across sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {portalFacts.map((item) => (
                <TableRow key={item.label}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell>{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}





