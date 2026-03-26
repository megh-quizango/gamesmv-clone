import React from 'react';
import { Apple, Monitor, Smartphone } from 'lucide-react';
import { Platform } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function PlatformIcons({ platforms, className }: { platforms: Platform[], className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {platforms.includes("android") && (
        <div className="bg-emerald-500/10 text-emerald-500 p-1 rounded-md" title="Android">
          <Smartphone size={14} className="fill-current" />
        </div>
      )}
      {platforms.includes("ios") && (
        <div className="bg-blue-500/10 text-blue-400 p-1 rounded-md" title="iOS">
          <Apple size={14} className="fill-current" />
        </div>
      )}
      {platforms.includes("pc") && (
        <div className="bg-purple-500/10 text-purple-400 p-1 rounded-md" title="PC">
          <Monitor size={14} />
        </div>
      )}
    </div>
  );
}
