import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ className, icon: Icon, children, ...props }, ref) => {
    return (
        <div className="relative group">
            {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-500/50 group-focus-within:text-gold-500 transition-colors duration-300 z-10 hover:text-gold-500" />
            )}
            <select
                className={cn(
                    "flex h-12 w-full appearance-none rounded-sm border border-white/10 bg-wood-800/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 disabled:cursor-not-allowed disabled:opacity-50 text-cream-100 transition-all duration-300 hover:bg-wood-800/80 hover:border-white/20 cursor-pointer",
                    Icon && "pl-10",
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-200/30 pointer-events-none group-hover:text-gold-500 transition-colors" />
        </div>
    );
});

Select.displayName = "Select";

export { Select };
