import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';

const AlertDialogContext = createContext({
    open: false,
    onOpenChange: () => { }
});

export const AlertDialog = ({ open, onOpenChange, children }) => {
    return (
        <AlertDialogContext.Provider value={{ open: !!open, onOpenChange: onOpenChange || (() => { }) }}>
            {open && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    {children}
                </div>
            )}
        </AlertDialogContext.Provider>
    );
};

export const AlertDialogContent = ({ children, className }) => (
    <div className={cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg bg-white", className)}>
        {children}
    </div>
);

export const AlertDialogHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

export const AlertDialogFooter = ({ className, ...props }) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

export const AlertDialogTitle = ({ className, ...props }) => (
    <h2 className={cn("text-lg font-semibold", className)} {...props} />
);

export const AlertDialogDescription = ({ className, ...props }) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const AlertDialogAction = ({ className, ...props }) => (
    <Button className={cn(className)} {...props} />
);

export const AlertDialogCancel = ({ className, onClick, ...props }) => {
    const { onOpenChange } = useContext(AlertDialogContext);
    return (
        <Button variant="outline" className={cn("mt-2 sm:mt-0", className)} onClick={(e) => {
            onClick && onClick(e);
            onOpenChange(false);
        }} {...props} />
    );
};
