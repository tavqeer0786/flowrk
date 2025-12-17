import React from 'react';
import { cn } from '@/utils';

const Badge = ({ className, variant = "default", ...props }) => {
    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            variant === "default" && "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 bg-teal-600 text-white",
            variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-100 text-gray-900",
            variant === "destructive" && "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 bg-red-600 text-white",
            variant === "outline" && "text-foreground",
            className
        )} {...props} />
    );
}

export { Badge }
