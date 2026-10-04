import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to The Neo Syndicate member portal.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Member access"
      title="Sign in to the portal"
      description="Elite trades, desk announcements and your applications — in one place."
      footer={
        <>
          New to the Syndicate?{" "}
          <Link href="/signup" className="text-cyan-light underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-80" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
