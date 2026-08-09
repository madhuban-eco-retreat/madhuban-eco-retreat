import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata = {
    title: "Set New Password — Madhuban Admin",
    robots: { index: false, follow: false },
};

// Outside the (authed) group. The visitor arrives here holding a recovery
// session, which is enough to change a password and nothing else — it has not
// cleared the OTP step, so the admin layout would turn it away.
export default function ResetPasswordPage() {
    return (<AdminAuthShell title="Set New Password" subtitle="Choose a new password for your admin account.">
      <ResetPasswordForm />
    </AdminAuthShell>);
}
