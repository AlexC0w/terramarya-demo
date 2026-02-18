import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
    return (
        <div className="relative group">
            {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-500/50 group-focus-within:text-gold-500 transition-colors duration-300" />
            )}
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-sm border border-white/10 bg-wood-800/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cream-200/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 disabled:cursor-not-allowed disabled:opacity-50 text-cream-100 transition-all duration-300 hover:bg-wood-800/80 hover:border-white/20",
                    Icon && "pl-10",
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});

Input.displayName = "Input";

export { Input };
