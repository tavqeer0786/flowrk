import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/utils';

const SelectContext = createContext({
    value: '',
    onValueChange: () => { },
    open: false,
    setOpen: () => { }
});

export const Select = ({ children, value, onValueChange }) => {
    const [open, setOpen] = useState(false);
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative inline-block w-full">{children}</div>
        </SelectContext.Provider>
    );
};

export const SelectTrigger = ({ children, className }) => {
    const { setOpen, open } = useContext(SelectContext);
    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
        </button>
    );
};

export const SelectValue = ({ placeholder }) => {
    const { value } = useContext(SelectContext);
    // Ideally this would look up the label for the value, but for simplicity we'll just show value or placeholder.
    // In a real implementation we might need children children traversal or context to hold options labels.
    // For now, let's just show value if present.
    return <span>{value || placeholder}</span>;
};

export const SelectContent = ({ children }) => {
    const { open } = useContext(SelectContext);
    if (!open) return null;
    return (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md bg-white">
            <div className="p-1">{children}</div>
        </div>
    );
};

export const SelectItem = ({ children, value }) => {
    const { onValueChange, setOpen } = useContext(SelectContext);
    return (
        <div
            onClick={() => {
                onValueChange(value);
                setOpen(false);
            }}
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100 cursor-pointer"
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {/* Check icon if selected */}
            </span>
            <span>{children}</span>
        </div>
    );
};
