import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSmsBalance } from "@/lib/sms";

export default async function DashboardPage() {
  const balance = await getSmsBalance().catch(() => ({ response_code: 500, balance: 0 }));

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Welcome to the SMS Portal</h1>
        <p className="text-muted-foreground">
          This dashboard is now open to everyone. Use the sidebar to send single or bulk SMS without signing in.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>SMS Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">৳ {balance.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Response code: {balance.response_code}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
