import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const user = session.user as any;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">ID</TableCell>
                <TableCell>{user?.id ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{user?.name ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell>{user?.email ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Role</TableCell>
                <TableCell>{user?.role ?? "user"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="max-w-sm">
        <SignOutButton />
      </div>
    </div>
  );
}





