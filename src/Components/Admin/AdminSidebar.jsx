import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Settings,
    FileText,
    Bell,
    History,
    ArrowLeft,
    ChevronRight
} from 'lucide-react';

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Jobs & Listings', path: '/admin/jobs', icon: Briefcase },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'CMS & Content', path: '/admin/cms', icon: FileText },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        { name: 'Logs & History', path: '/admin/logs', icon: History },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl overflow-y-auto">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-lg">F</div>
                    <div>
                        <span className="font-bold text-lg block leading-none">Flowrk</span>
                        <span className="text-teal-500 text-xs font-bold font-mono tracking-tighter uppercase">Admin Panel</span>
                    </div>
                </Link>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 py-6 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-teal-500' : 'group-hover:text-white'}`} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Website</span>
                </Link>
                <div className="bg-slate-800/50 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-slate-300">Live & Connected</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
