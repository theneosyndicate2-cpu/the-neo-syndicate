import { getCurrentUser } from "@/lib/server/auth";
import { PasswordForm, ProfileForm, SessionsCard } from "@/components/portal/AccountForms";

export const metadata = { title: "Account" };

export default async function PortalAccountPage() {
  const user = (await getCurrentUser())!;
  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="eyebrow">Account</p>
        <h1 className="mt-4 font-display text-3xl font-light tracking-[-0.02em] text-bone sm:text-4xl">Settings</h1>
      </header>
      <ProfileForm email={user.email} initial={{ name: user.name, telegram: user.telegram ?? "" }} />
      <PasswordForm email={user.email} />
      <SessionsCard />
    </div>
  );
}
