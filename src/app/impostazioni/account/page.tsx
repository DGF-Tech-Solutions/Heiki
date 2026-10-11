import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { roleLabel } from "@/lib/auth/permissions";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { Stat, StatGrid } from "@/components/ui";
import { ChangeEmailForm, ChangePasswordForm, DeleteAccountForm } from "./account-forms";

const TESTI = testi({
  it: {
    titoloPagina: "Account",
    handle: "Handle",
    ruolo: "Ruolo",
    iscrittoIl: "Iscritto il",
    accesso: "Accesso",
    emailPassword: "email e password",
    soloEsterno: "solo esterno",
  },
  en: {
    titoloPagina: "Account",
    handle: "Handle",
    ruolo: "Role",
    iscrittoIl: "Joined",
    accesso: "Sign-in",
    emailPassword: "email and password",
    soloEsterno: "external only",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

export default async function AccountSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entra");

  const locale = await getLocale();
  const t = TESTI[locale];

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { email: true, username: true, role: true, createdAt: true, passwordHash: true },
  });
  if (!user) redirect("/entra");

  return (
    <div className="grid gap-5">
      <StatGrid columns="repeat(auto-fit, minmax(150px, 1fr))">
        <Stat label={t.handle} value={`@${user.username}`} small />
        <Stat label={t.ruolo} value={roleLabel(user.role, locale)} small />
        <Stat
          label={t.iscrittoIl}
          small
          value={user.createdAt.toLocaleDateString(intlLocale(locale), {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
        <Stat
          label={t.accesso}
          small
          value={user.passwordHash ? t.emailPassword : t.soloEsterno}
        />
      </StatGrid>

      <ChangeEmailForm current={user.email} />
      <ChangePasswordForm />
      <DeleteAccountForm hasPassword={user.passwordHash != null} />
    </div>
  );
}
