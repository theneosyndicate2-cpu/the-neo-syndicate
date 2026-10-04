import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a Neo Syndicate account to access the member portal.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Join the Syndicate"
      title="Create your account"
      description="Start as an Observer. Membership tiers unlock elite trades and pool access."
      footer={
        <>
          Already a member?{" "}
          <Link href="/login" className="text-cyan-light underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
