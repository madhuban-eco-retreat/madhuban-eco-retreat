'use client';
import { cn } from '@/lib/utils';
export function Tabs({ tabs, value, onChange, className }) {
    return (<div role="tablist" aria-label="Tabs" className={cn('flex border-b border-admin-card-border', className)}>
      {tabs.map((tab) => {
            const active = tab.value === value;
            return (<button key={tab.value} type="button" role="tab" aria-selected={active} onClick={() => onChange(tab.value)} className={cn('relative -mb-px px-4 py-3 font-body text-sm font-medium transition-colors', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-accent/40', active
                    ? 'text-charcoal border-b-2 border-gold-accent'
                    : 'text-charcoal/50 hover:text-charcoal')}>
            {tab.label}
          </button>);
        })}
    </div>);
}
