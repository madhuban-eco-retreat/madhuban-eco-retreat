import { resolveAdminUser } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/ui/Sidebar';
import { TopBar } from '@/components/admin/ui/TopBar';
import { AdminToaster } from '@/components/admin/ui/AdminToaster';
export default async function AuthedLayout({ children }) {
    // Gated on the same rule the API routes use. Checking only "is there a
    // user" here let an unprovisioned account into the panel where every
    // action then failed with a bare 401 and no explanation.
    const { user, authorized, reason } = await resolveAdminUser();
    if (!user)
        redirect('/admin/login');
    // An expired admin window is not an authorisation problem — the account is
    // fine, the login has simply run out. Signing in again fixes it, so send
    // them to do that rather than showing a wall that offers no way forward.
    if (reason === 'session_expired')
        redirect('/admin/login?expired=1');
    if (!authorized)
        return <NotProvisioned email={user.email} reason={reason}/>;
    return (<div className="flex min-h-screen bg-admin-canvas-bg">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full">
          {children}
        </main>
      </div>
      <AdminToaster />
    </div>);
}

/**
 * Shown when sign-in succeeded but the account carries no admin access. Names
 * the address so whoever is looking can tell they are signed in as the wrong
 * one — a redirect back to /admin/login would just loop, since logging in again
 * is not the problem.
 */
function NotProvisioned({ email, reason }) {
    const deactivated = reason === 'deactivated';
    return (<div className="flex min-h-screen items-center justify-center bg-admin-canvas-bg px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-admin-card-border bg-admin-card-bg p-8 shadow-sm">
        <h1 className="font-display text-2xl font-medium text-charcoal">
          {deactivated ? 'Access deactivated' : 'Account not authorised'}
        </h1>
        <p className="mt-3 font-body text-sm text-charcoal/70">
          You are signed in as{' '}
          <span className="font-medium text-charcoal">{email}</span>
          {deactivated
            ? ', but this account has been deactivated.'
            : ", but this account has not been granted admin access."}
        </p>
        <p className="mt-3 font-body text-sm text-charcoal/70">
          {deactivated
            ? 'Ask an administrator to reactivate it.'
            : 'Ask an administrator to add it to the staff list, or sign in with an authorised address.'}
        </p>
        <a href="/admin/login" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-forest-green font-body text-sm font-medium text-ivory transition-opacity hover:opacity-90">
          Sign in with a different account
        </a>
      </div>
    </div>);
}
