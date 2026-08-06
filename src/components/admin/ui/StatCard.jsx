import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
const deltaClasses = {
    up: 'text-admin-status-confirmed-fg',
    down: 'text-admin-status-cancelled-fg',
    neutral: 'text-admin-status-neutral-fg',
};
const DeltaIcon = ({ direction }) => {
    const cls = 'w-3 h-3';
    if (direction === 'up')
        return <TrendingUp className={cls}/>;
    if (direction === 'down')
        return <TrendingDown className={cls}/>;
    return <Minus className={cls}/>;
};
function StatCardInner({ label, value, delta, icon }) {
    return (<>
      <div className="flex items-start justify-between mb-3">
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/60">
          {label}
        </p>
        {icon && (<div className="flex-shrink-0 rounded-lg bg-gold-accent/10 p-2 text-gold-accent">
            {icon}
          </div>)}
      </div>
      <p className="font-display text-4xl text-charcoal">{value}</p>
      {delta && (<div className={cn('mt-2 inline-flex items-center gap-1 font-body text-xs', deltaClasses[delta.direction])}>
          <DeltaIcon direction={delta.direction}/>
          {delta.value}
        </div>)}
    </>);
}
export function StatCard({ label, value, delta, icon, href, className }) {
    if (href) {
        return (<Link href={href} className="block group">
        <Card className={cn('transition-shadow group-hover:shadow-md group-hover:border-admin-card-border/70', className)}>
          <StatCardInner label={label} value={value} delta={delta} icon={icon}/>
        </Card>
      </Link>);
    }
    return (<Card className={className}>
      <StatCardInner label={label} value={value} delta={delta} icon={icon}/>
    </Card>);
}
