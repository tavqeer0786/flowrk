import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50 flex-row">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block shrink-0">
                <AdminSidebar />
            </div>

            {/* Content Area */}
            <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
                {/* Minimal Header if needed */}
                <header className="lg:hidden bg-slate-900 p-4 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-white">F</div>
                        <span className="font-bold text-white">Flowrk Admin</span>
                    </div>
                    {/* Mobile menu trigger could be here, but simplified for now */}
                </header>

                <div className="flex-1 p-4 md:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>

                {/* Optional Mobile Navigation Placeholder */}
                <div className="lg:hidden h-16 shrink-0 border-t bg-white sticky bottom-0" />
            </main>
        </div>
    );
};

export default AdminLayout;
