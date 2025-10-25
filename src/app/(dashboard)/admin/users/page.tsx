import { getPrismaClient } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";
import { hash } from "bcryptjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = getPrismaClient();

async function createUserAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const schema = z.object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "USER"]),
  });
  const payload = {
    name: formData.get("name")?.toString() || undefined,
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    role: (formData.get("role")?.toString() as "ADMIN" | "USER") || "USER",
  };
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error("Invalid input");
  const passwordHash = await hash(parsed.data.password, 10);
  await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash, role: parsed.data.role as any },
  });
}

export default async function UsersPage() {
  const session = await getSession();
  if (!session || (session.user as any).role !== "ADMIN") {
    return <div className="p-6">Unauthorized</div>;
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createUserAction} className="grid gap-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select id="role" name="role" className="border rounded-md h-10 px-3">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
