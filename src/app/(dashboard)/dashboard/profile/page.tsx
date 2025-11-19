import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const portalFacts = [
  { label: "Access", value: "Public (no sign-in required)" },
  { label: "SMS Footer", value: process.env.DEFAULT_SMS_FOOTER ?? "- BAIUST Computer Club" },
  { label: "Single Send", value: "/sms/single" },
  { label: "Bulk Send", value: "/sms/bulk" },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portal Access</CardTitle>
          <CardDescription>
            Authentication has been removed. Anyone with the link can schedule or send SMS from this interface.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            If you need to limit access again in the future, reintroduce authentication or place the deployment behind a
            network-level restriction such as a VPN or reverse proxy allow-list.
          </p>
          <p>Until then, keep your SMS API key rotated regularly and monitor usage from your SMS gateway dashboard.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Facts</CardTitle>
          <CardDescription>Reference values that are always available for every visitor.</CardDescription>
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





