import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata = {
    title: "Forgot Password — Madhuban Admin",
    robots: { index: false, follow: false },
};

// Deliberately outside the (authed) group: someone who cannot log in is exactly
// who needs this page, so it must not sit behind the session it is meant to
// restore.
export default function ForgotPasswordPage() {
    return (<AdminAuthShell title="Forgot Password" subtitle="Enter your admin email address and we'll send you a link to reset your password.">
      <ForgotPasswordForm />
    </AdminAuthShell>);
}
