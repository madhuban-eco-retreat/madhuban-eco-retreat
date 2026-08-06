import { cn } from '@/lib/utils';
const variantClasses = {
    default: 'p-6',
    padded: 'p-8',
    compact: 'p-4',
    ghost: 'p-6 border-transparent shadow-none bg-transparent',
};
export function Card({ children, variant = 'default', className }) {
    return (<div className={cn('bg-admin-card-bg rounded-xl border border-admin-card-border', 'shadow-[var(--admin-card-shadow)]', variantClasses[variant], className)}>
      {children}
    </div>);
}
