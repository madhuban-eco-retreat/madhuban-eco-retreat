import { cn } from '@/lib/utils';
const variantClasses = {
    confirmed: 'bg-admin-status-confirmed-bg text-admin-status-confirmed-fg',
    pending: 'bg-admin-status-pending-bg text-admin-status-pending-fg',
    cancelled: 'bg-admin-status-cancelled-bg text-admin-status-cancelled-fg',
    info: 'bg-admin-status-info-bg text-admin-status-info-fg',
    neutral: 'bg-admin-status-neutral-bg text-admin-status-neutral-fg',
};
export function Badge({ variant, children, className }) {
    return (<span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5', 'font-body text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>);
}
