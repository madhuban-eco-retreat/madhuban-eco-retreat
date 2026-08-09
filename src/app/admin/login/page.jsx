import { redirect } from "next/navigation";
import { resolveAdminUser } from "@/lib/admin/auth";
import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin Login — Madhuban Eco Retreat" };

export default async function LoginPage({ searchParams }) {
    // resolveAdminUser rather than a bare getUser: a browser holding a Supabase
    // session that has not cleared the OTP step, or whose 24-hour window has
    // run out, must be able to reach this page. Bouncing it to /admin would
    // land on a layout that sends it straight back here.
    const { authorized } = await resolveAdminUser();
    if (authorized)
        redirect("/admin");

    const params = await searchParams;
    const notice = params?.expired
        ? "Your session has expired. Please sign in again."
        : params?.error === "auth_failed"
            ? "That link could not be verified. Please sign in again."
            : null;

    return (<AdminAuthShell title="Welcome Back" subtitle="Please enter your administrative credentials to continue." footer="Having trouble logging in? Contact System Administrator">
      {notice && (<p role="status" className="mb-4 rounded-xl border border-[var(--color-gold-accent)]/40 bg-[var(--color-gold-accent)]/10 px-4 py-3 font-body text-xs text-[var(--color-charcoal)]/80">
          {notice}
        </p>)}
      <LoginForm />
    </AdminAuthShell>);
}
