import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Search,
    Shield,
    User,
    Clock,
    Activity,
    AlertTriangle,
    Database,
    Filter,
    Calendar,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { base44 } from '../api/base44Client';

const AdminLogs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const logsData = await base44.dbRead('audit_logs') || {};
                const logsList = Object.values(logsData).sort((a, b) =>
                    new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
                );
                setLogs(logsList);
            } catch (err) {
                console.error("Failed to fetch logs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        (log.admin_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.target_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSeverityIcon = (sev) => {
        switch (sev) {
            case 'high': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
            case 'medium': return <Activity className="w-4 h-4 text-amber-500" />;
            default: return <Shield className="w-4 h-4 text-teal-600" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-none">System Audit Trail</h1>
                    <p className="text-gray-500 text-sm mt-2">Historical record of all privileged administrative procedures.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search parameters..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-teal-500/10 outline-none w-72 transition-all font-bold"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Decoding Secure Logs...</p>
                    </div>
                )}

                <div className="divide-y divide-gray-50 flex-1">
                    {filteredLogs.length === 0 && !loading ? (
                        <div className="p-20 text-center space-y-4">
                            <Database className="w-12 h-12 text-gray-100 mx-auto" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed"> No event signatures found in current sector.<br />Initial sequences will appear here. </p>
                        </div>
                    ) : filteredLogs.map((log, idx) => (
                        <div key={log.id || idx} className="p-6 hover:bg-gray-50/50 transition-all flex items-center gap-6 group">
                            <div className={`p-3 rounded-2xl shrink-0 border border-gray-100 shadow-sm ${log.severity === 'high' ? 'bg-rose-50' : 'bg-teal-50/50'
                                }`}>
                                {getSeverityIcon(log.severity)}
                            </div>

                            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                <div className="md:col-span-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-teal-700 border border-white shadow-sm shrink-0">
                                            {log.admin_name?.charAt(0) || 'S'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tighter">{log.admin_name || 'System Auto'}</p>
                                            <p className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter uppercase">{log.id?.substring(0, 8) || 'KERNEL'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest mb-1">{log.type || 'EVENT'}</span>
                                        <p className="text-xs font-bold text-gray-800 leading-none">{log.action || 'Unknown Operation'}</p>
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <p className="text-[11px] font-bold text-gray-500 font-mono bg-gray-50 p-1.5 rounded-lg border border-gray-100 truncate">TARGET::{(log.target_name || log.target_id || 'LOCAL-NODE').toUpperCase()}</p>
                                </div>

                                <div className="md:col-span-1 flex items-center justify-end gap-6">
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                            <Clock className="w-3.5 h-3.5" /> {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Live'}
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex justify-center">
                    <button className="text-[10px] font-black text-gray-400 hover:text-teal-600 transition-colors flex items-center gap-3 uppercase tracking-widest">
                        <Database className="w-4 h-4" /> Full Cryptographic Export (.RAW)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
