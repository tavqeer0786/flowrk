import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/utils';

const DropdownContext = createContext({ open: false, setOpen: () => { } });

export const DropdownMenu = ({ children }) => {
    const [open, setOpen] = useState(false);
    return <DropdownContext.Provider value={{ open, setOpen }}><div className="relative inline-block text-left">{children}</div></DropdownContext.Provider>;
};

export const DropdownMenuTrigger = ({ children, asChild }) => {
    const { open, setOpen } = useContext(DropdownContext);
    return (
        <div onClick={() => setOpen(!open)} className="cursor-pointer">
            {children}
        </div>
    );
};

export const DropdownMenuContent = ({ children, className, align = 'center' }) => {
    const { open } = useContext(DropdownContext);
    if (!open) return null;

    const alignClass = align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2';

    return (
        <div className={cn("absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md bg-white", alignClass, className)}>
            {children}
        </div>
    );
};

export const DropdownMenuItem = ({ children, className, onClick }) => {
    const { setOpen } = useContext(DropdownContext);
    return (
        <div
            className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-100 cursor-pointer", className)}
            onClick={(e) => {
                onClick && onClick(e);
                setOpen(false)
            }}
        >
            {children}
        </div>
    );
};

export const DropdownMenuSeparator = () => (
    <div className="-mx-1 my-1 h-px bg-zinc-200" />
);

export const DropdownMenuLabel = ({ children }) => <div className="px-2 py-1.5 text-sm font-semibold">{children}</div>;
