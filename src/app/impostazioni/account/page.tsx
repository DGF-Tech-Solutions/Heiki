import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import { Stat, StatGrid } from "@/components/ui";
import { ChangeEmailForm, ChangePasswordForm, DeleteAccountForm } from "./account-forms";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entra");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { email: true, username: true, role: true, createdAt: true, passwordHash: true },
  });
  if (!user) redirect("/entra");

  return (
    <div className="grid gap-5">
      <StatGrid columns="repeat(auto-fit, minmax(150px, 1fr))">
        <Stat label="Handle" value={`@${user.username}`} small />
        <Stat label="Ruolo" value={ROLE_LABELS[user.role]} small />
        <Stat
          label="Iscritto il"
          small
          value={user.createdAt.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
        <Stat
          label="Accesso"
          small
          value={user.passwordHash ? "email e password" : "solo esterno"}
        />
      </StatGrid>

      <ChangeEmailForm current={user.email} />
      <ChangePasswordForm />
      <DeleteAccountForm />
    </div>
  );
}
