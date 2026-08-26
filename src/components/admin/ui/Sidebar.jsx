'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Bed, Calendar, CalendarRange, Tag, Settings, ClipboardList, HelpCircle, LogOut, Menu, X, FileText, ChevronDown, } from 'lucide-react';
import { cn } from '@/lib/utils';
const R2 = process.env.NEXT_PUBLIC_R2_BASE ?? '';
// The source also listed Souvenir Shop, Gallery, Featured Experiences, Leads
// and Staff. Those sections were never ported, so linking to them would only
// produce 404s. Blog Posts is live and appears below with its own sub-nav.
const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
    { icon: Bed, label: 'Rooms', href: '/admin/rooms' },
    { icon: CalendarRange, label: 'Availability', href: '/admin/availability' },
    { icon: Receipt, label: 'Invoices', href: '/admin/invoices' },
    { icon: Tag, label: 'Coupons', href: '/admin/coupons' },
    { icon: ClipboardList, label: 'Audit Log', href: '/admin/audit-log' },
];
// Rendered separately in the sidebar footer, below the nav list.
const SETTINGS_ITEM = { icon: Settings, label: 'Settings', href: '/admin/settings' };
// Blog is the one section deep enough to need children of its own.
const BLOG_SECTION = {
    icon: FileText,
    label: 'Blog Posts',
    href: '/admin/blogs',
    children: [
        { label: 'All Posts', href: '/admin/blogs' },
        { label: 'New Post', href: '/admin/blogs/new' },
        { label: 'Categories', href: '/admin/blogs/categories' },
        { label: 'Authors', href: '/admin/blogs/authors' },
    ],
};
function NavLink({ href, icon: Icon, label, onClick, }) {
    const pathname = usePathname();
    const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
    return (<Link href={href} onClick={onClick} className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-colors', active
            ? 'bg-admin-sidebar-active-bg text-admin-sidebar-active-fg'
            : 'text-admin-sidebar-fg-muted hover:bg-admin-sidebar-active-bg/60 hover:text-admin-sidebar-fg')}>
      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true"/>
      {label}
    </Link>);
}
/**
 * Collapsible section. Starts open whenever the current page is inside it, so
 * arriving from a bookmark does not hide where you already are.
 */
function NavSection({ section, onClose }) {
    const pathname = usePathname();
    const sectionActive = pathname.startsWith(section.href);
    const [open, setOpen] = useState(sectionActive);
    const Icon = section.icon;
    return (<div>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={cn('flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-colors', sectionActive
            ? 'bg-admin-sidebar-active-bg text-admin-sidebar-active-fg'
            : 'text-admin-sidebar-fg-muted hover:bg-admin-sidebar-active-bg/60 hover:text-admin-sidebar-fg')}>
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true"/>
        {section.label}
        <ChevronDown className={cn('ml-auto w-3.5 h-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true"/>
      </button>
      {open && (<div className="mt-0.5 ml-4 space-y-0.5 pl-3" style={{ borderLeft: '1px solid var(--admin-sidebar-border)' }}>
          {section.children.map((child) => (<SubNavLink key={child.href} href={child.href} label={child.label} onClick={onClose}/>))}
        </div>)}
    </div>);
}

function SubNavLink({ href, label, onClick }) {
    const pathname = usePathname();
    // Exact match: /admin/blogs would otherwise light up for every child.
    const active = pathname === href;
    return (<Link href={href} onClick={onClick} className={cn('block px-3 py-2 rounded-lg font-body text-[13px] transition-colors', active
            ? 'text-admin-sidebar-active-fg bg-admin-sidebar-active-bg/70'
            : 'text-admin-sidebar-fg-muted hover:text-admin-sidebar-fg hover:bg-admin-sidebar-active-bg/40')}>
      {label}
    </Link>);
}

function SidebarContent({ onClose }) {
    return (<aside className="flex flex-col w-64 min-h-screen bg-admin-sidebar-bg">
      {/* Logo + wordmark */}
      <div className="px-5 py-6 flex-shrink-0" style={{ borderBottom: '1px solid var(--admin-sidebar-border)' }}>
        <div className="flex items-center gap-3">
          <Image src={`${R2}/branding/logo/madhuban-mark-md.webp`} alt="Madhuban Eco Retreat" width={40} height={40} className="rounded-lg flex-shrink-0"/>
          <div className="min-w-0">
            <p className="font-display text-admin-sidebar-fg text-lg leading-tight">
              Madhuban
            </p>
            <p className="font-body text-admin-sidebar-fg-muted text-[10px] uppercase tracking-[0.18em] leading-tight mt-0.5">
              Eco Retreat Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ icon, label, href }) => (<NavLink key={href} href={href} icon={icon} label={label} onClick={onClose}/>))}
        <NavSection section={BLOG_SECTION} onClose={onClose}/>
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 flex-shrink-0 space-y-0.5" style={{ borderTop: '1px solid var(--admin-sidebar-border)' }}>
        <NavLink href={SETTINGS_ITEM.href} icon={SETTINGS_ITEM.icon} label={SETTINGS_ITEM.label} onClick={onClose}/>
        <button type="button" disabled className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm text-admin-sidebar-fg-muted opacity-40 cursor-not-allowed">
          <HelpCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true"/>
          Support
        </button>
        <form action="/admin/logout" method="POST">
          <button type="submit" className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm text-admin-sidebar-fg-muted hover:bg-admin-sidebar-active-bg/60 hover:text-admin-sidebar-fg transition-colors">
            <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true"/>
            Logout
          </button>
        </form>
      </div>
    </aside>);
}
export function AdminSidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (<>
      {/* Desktop — fixed sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile — hamburger button */}
      <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" className="lg:hidden fixed top-4 left-4 z-40 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-admin-sidebar-bg text-admin-sidebar-fg shadow-md">
        <Menu className="w-5 h-5"/>
      </button>

      {/* Mobile — overlay + drawer */}
      {mobileOpen && (<>
          <div className="lg:hidden fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden="true"/>
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 flex shadow-xl">
            <SidebarContent onClose={() => setMobileOpen(false)}/>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu" className="absolute top-4 right-4 p-1 text-admin-sidebar-fg-muted hover:text-admin-sidebar-fg">
              <X className="w-5 h-5"/>
            </button>
          </div>
        </>)}
    </>);
}
