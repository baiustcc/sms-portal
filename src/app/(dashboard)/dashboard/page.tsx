import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSmsBalance } from "@/lib/sms";
import { readSession } from "@/lib/session";

export default async function DashboardPage() {
  const [session, balance] = await Promise.all([
    readSession(),
    getSmsBalance().catch(() => ({ response_code: 500, balance: 0 })),
  ]);

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Welcome{session?.number ? `, ${session.number.slice(-4).padStart(session.number.length, "•")}` : ""}
        </h1>
        <p className="text-muted-foreground">Use the sidebar to navigate the secure SMS tools.</p>
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
