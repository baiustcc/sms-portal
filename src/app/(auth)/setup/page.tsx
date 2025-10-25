import { getPrismaClient } from "@/lib/db";
import { z } from "zod";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const prisma = getPrismaClient();

async function createInitialAdmin(formData: FormData) {
  "use server";
  const schema = z.object({ name: z.string().optional(), email: z.string().email(), password: z.string().min(6) });
  const payload = {
    name: formData.get("name")?.toString() || undefined,
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };
  const parsed = schema.safeParse(payload);
  if (!parsed.success) throw new Error("Invalid input");
  const userCount = await prisma.user.count();
  if (userCount > 0) redirect("/signin");
  const passwordHash = await hash(parsed.data.password, 10);
  await prisma.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash, role: "ADMIN" as any },
  });
  redirect("/signin");
}

export default async function SetupPage() {
  const userCount = await prisma.user.count();
  if (userCount > 0) redirect("/signin");
  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Initial Admin Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createInitialAdmin} className="space-y-4">
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
            <Button type="submit" className="w-full">
              Create Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}






