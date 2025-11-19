import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCircleCheck } from "@tabler/icons-react";

const hardeningChecklist = [
  "Restrict the deployment URL at the proxy, CDN, or hosting platform.",
  "Rotate SMS API credentials regularly and store them in your hosting provider secrets.",
  "Scope API keys to the minimum number of sender IDs where possible.",
  "Monitor bulk send usage directly from the SMS provider dashboard.",
];

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Access Controls</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manual Access Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Authentication and user provisioning have been removed from this portal. Use your infrastructure perimeter
            (reverse proxy, firewall rules, VPN, etc.) to decide who can reach the dashboard.
          </p>
          <p className="text-foreground font-medium">Operational checklist:</p>
          <ul className="space-y-2 text-foreground">
            {hardeningChecklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <IconCircleCheck className="mt-0.5 shrink-0 text-muted-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
