import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils';

const TabsContext = createContext({
    value: '',
    onValueChange: () => { }
});

export const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
    const [val, setVal] = useState(defaultValue || value);
    const currentVal = value !== undefined ? value : val;
    const onChange = onValueChange || setVal;

    return (
        <TabsContext.Provider value={{ value: currentVal, onValueChange: onChange }}>
            <div className={cn("", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className }) => (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground bg-gray-100", className)}>
        {children}
    </div>
);

export const TabsTrigger = ({ value, children, className }) => {
    const { value: currentValue, onValueChange } = useContext(TabsContext);
    const isSelected = currentValue === value;
    return (
        <button
            type="button"
            onClick={() => onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected ? "bg-background text-foreground shadow-sm bg-white" : "hover:bg-gray-200",
                className
            )}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ value, children, className }) => {
    const { value: currentValue } = useContext(TabsContext);
    if (currentValue !== value) return null;
    return (
        <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    );
};
