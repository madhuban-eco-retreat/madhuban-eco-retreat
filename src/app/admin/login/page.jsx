import { redirect } from "next/navigation";
import { resolveAdminUser } from "@/lib/admin/auth";
import { missingSupabaseEnv } from "@/lib/supabase/env";
import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin Login — Madhuban Eco Retreat" };

export default async function LoginPage({ searchParams }) {
    // Configuration is checked before Supabase is touched. Letting the client
    // throw here surfaces as an opaque 500, because Next strips Server
    // Component error messages in production — an admin locked out of the panel
    // would have nothing to act on. Rendering the shortfall keeps the diagnosis
    // on the page.
    const missing = missingSupabaseEnv();

    if (missing.length === 0) {
        // resolveAdminUser rather than a bare getUser: a browser holding a
        // Supabase session that has not cleared the OTP step, or whose 24-hour
        // window has run out, must still be able to reach this page. Bouncing
        // it to /admin would land on a layout that sends it straight back.
        const { authorized } = await resolveAdminUser();
        if (authorized)
            redirect("/admin");
    }

    const params = await searchParams;
    const notice = params?.expired
        ? "Your session has expired. Please sign in again."
        : params?.error === "auth_failed"
            ? "That link could not be verified. Please sign in again."
            : null;

    return (<AdminAuthShell title="Welcome Back" subtitle="Please enter your administrative credentials to continue." footer="Having trouble logging in? Contact System Administrator">
      {notice && missing.length === 0 && (<p role="status" className="mb-4 rounded-xl border border-[var(--color-gold-accent)]/40 bg-[var(--color-gold-accent)]/10 px-4 py-3 font-body text-xs text-[var(--color-charcoal)]/80">
          {notice}
        </p>)}

      {missing.length === 0 ? (<LoginForm />) : (<div className="bg-white rounded-2xl border border-[var(--color-error)]/30 p-8 shadow-sm">
          <h3 className="font-display text-2xl text-[var(--color-charcoal)] mb-3">
            Sign-in unavailable
          </h3>
          <p className="font-body text-sm text-[var(--color-charcoal)]/70 mb-4">
            This deployment was built without its Supabase credentials, so the
            sign-in service could not be reached.
          </p>
          <p className="font-body text-xs text-[var(--color-charcoal)]/60 mb-2">
            Missing at build time:
          </p>
          <ul className="mb-4 space-y-1">
            {missing.map((name) => (<li key={name} className="font-mono text-xs text-[var(--color-error)]">
                {name}
              </li>))}
          </ul>
          <p className="font-body text-xs text-[var(--color-charcoal)]/60">
            These values are compiled in during the build. Set them in the
            hosting project&rsquo;s environment settings, then{" "}
            <strong className="text-[var(--color-charcoal)]">
              redeploy without build cache
            </strong>{" "}
            — updating them alone will not repair this deployment.
          </p>
        </div>)}
    </AdminAuthShell>);
}
