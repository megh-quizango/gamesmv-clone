import React from 'react';
import { Link, useLocation } from 'wouter';
import { CATEGORIES } from '@/lib/mock-data';
import { LayoutGrid, Flame, Clock, Gamepad2 } from 'lucide-react';

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={`w-64 shrink-0 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 custom-scrollbar py-6 pr-4 ${className}`}>
      <div className="space-y-6">
        
        {/* Main Nav (Visible on mobile when sidebar is open, hides redundant links on desktop but keeps structure) */}
        <div className="lg:hidden space-y-1 mb-6">
          <SidebarLink href="/" icon={<LayoutGrid size={18} />} label="Home" />
          <SidebarLink href="/platform/android" icon={<Gamepad2 size={18} />} label="Android Games" />
          <SidebarLink href="/platform/ios" icon={<Gamepad2 size={18} />} label="iOS Games" />
          <SidebarLink href="/platform/pc" icon={<Gamepad2 size={18} />} label="PC Games" />
        </div>

        <div>
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Discover
          </h3>
          <div className="space-y-1">
            <SidebarLink href="/category/action" icon={<Flame size={18} className="text-orange-500" />} label="Hot Games" />
            <SidebarLink href="/category/adventure" icon={<Clock size={18} className="text-blue-400" />} label="New Releases" />
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Categories
          </h3>
          <div className="space-y-0.5">
            {CATEGORIES.map(category => (
              <SidebarLink 
                key={category} 
                href={`/category/${category.toLowerCase()}`} 
                label={category} 
              />
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string, icon?: React.ReactNode, label: string }) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href} className={`
      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
      ${isActive 
        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }
    `}>
      {icon && <span className={isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground transition-colors'}>{icon}</span>}
      {!icon && <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors ml-1 mr-1.5" />}
      {label}
    </Link>
  );
}
