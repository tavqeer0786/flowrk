import React, { useState } from 'react';
import {
    Bell,
    Send,
    Users,
    Megaphone,
    MessageCircle,
    Clock,
    Trash2,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';

const AdminNotifications = () => {
    const [notificationType, setNotificationType] = useState('all');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSend = () => {
        setIsSending(true);
        // Simulate API call
        setTimeout(() => {
            setIsSending(false);
            setShowSuccess(true);
            setTitle('');
            setMessage('');
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    const sentNotifications = [
        { id: 1, title: 'Welcome New Users!', type: 'all', time: '2 hours ago', status: 'delivered' },
        { id: 2, title: 'Maintenance Alert', type: 'system', time: '1 day ago', status: 'delivered' },
        { id: 3, title: 'Holiday Special Bonus', type: 'workers', time: '3 days ago', status: 'delivered' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications & Alerts</h1>
                    <p className="text-gray-500 text-sm">Send platform-wide announcements or targeted alerts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Send New Notification */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                        <div className="p-2 bg-teal-50 rounded-lg">
                            <Send className="w-5 h-5 text-teal-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Send New Notification</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recipients</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['all', 'workers', 'employers'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setNotificationType(type)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${notificationType === type
                                                ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-900/10'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-teal-200'
                                            }`}
                                    >
                                        {type.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notification Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                placeholder="E.g., System Maintenance Scheduled"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-gray-400 font-medium resize-none h-32"
                                placeholder="Enter your announcement here..."
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handleSend}
                                disabled={isSending || !title || !message}
                                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/10 disabled:opacity-50"
                            >
                                {isSending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                                Send Notification
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sent Notifications History */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">Sent Notifications</h3>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">Last 30 Days</span>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {sentNotifications.map((notif) => (
                            <div key={notif.id} className="p-4 hover:bg-gray-50 transition-all flex items-start gap-4 group">
                                <div className="mt-1 p-2 bg-gray-100 rounded-lg group-hover:bg-teal-50 transition-colors">
                                    <Bell className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${notif.type === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {notif.type === 'all' ? 'PUSH ALL' : 'TOWARDS ' + notif.type.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {notif.time}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                                        <CheckCircle2 className="w-3 h-3" /> {notif.status}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 transition-all p-1 text-gray-400 hover:text-red-500">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {showSuccess && (
                        <div className="p-4 bg-green-600 text-white text-sm font-bold text-center animate-in slide-in-from-bottom flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Message Delivered to Users!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
