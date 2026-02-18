import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, isLoading, ...props }, ref) => {
    const variants = {
        primary: 'bg-wine-500 hover:bg-wine-600 text-white border-wine-700 shadow-lg',
        outline: 'bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-wood-900',
        ghost: 'bg-transparent hover:bg-wood-500/10 text-cream-200',
        gold: 'bg-gradient-to-r from-gold-400 to-gold-600 text-wood-900 hover:from-gold-300 hover:to-gold-500 font-bold shadow-gold-500/20',
    };

    const sizes = {
        default: 'h-12 px-6 py-3',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-sm font-serif font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
