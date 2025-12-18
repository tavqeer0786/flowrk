import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    UserX,
    UserCheck,
    Eye,
    Shield,
    ShieldCheck,
    MapPin,
    Phone,
    Mail,
    ArrowUpDown,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { base44 } from '../api/base44Client';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const workersData = await base44.dbRead('workers') || {};
            const employersData = await base44.dbRead('employers') || {};

            const workers = Object.values(workersData).map(u => ({ ...u, role: 'worker' }));
            const employers = Object.values(employersData).map(u => ({ ...u, role: 'employer' }));

            setUsers([...workers, ...employers]);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone || '').includes(searchTerm) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
        try {
            if (user.role === 'worker') {
                await base44.entities.WorkerProfile.update(user.id, { status: newStatus });
            } else {
                await base44.entities.EmployerProfile.update(user.id, { status: newStatus });
            }
            // Update local state
            setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
            if (selectedUser?.id === user.id) setSelectedUser({ ...selectedUser, status: newStatus });
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleToggleVerify = async (user) => {
        const newVerified = !user.verified;
        try {
            if (user.role === 'worker') {
                await base44.entities.WorkerProfile.update(user.id, { verified: newVerified });
            } else {
                await base44.entities.EmployerProfile.update(user.id, { verified: newVerified });
            }
            // Update local state
            setUsers(users.map(u => u.id === user.id ? { ...u, verified: newVerified } : u));
            if (selectedUser?.id === user.id) setSelectedUser({ ...selectedUser, verified: newVerified });
        } catch (err) {
            alert("Failed to update verification");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 text-sm">View, verify, and manage all workers and employers on the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-500 outline-none w-72 transition-all"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
                    >
                        <option value="all">All Profiles</option>
                        <option value="worker">Workers Only</option>
                        <option value="employer">Employers Only</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Profile</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact / Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Verified</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-sm text-gray-400 font-medium">Syncing with database...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 italic">No users found matching your criteria.</td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-teal-700 font-bold border border-gray-200">
                                                {user.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{user.full_name || 'Anonymous User'}</p>
                                                <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{user.id.substring(0, 12)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${user.role === 'worker' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-xs text-gray-600 font-medium">{user.email || user.phone || 'No contact info'}</p>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <MapPin className="w-3 h-3" />
                                                {user.city || 'Location not set'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.status !== 'blocked' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status !== 'blocked' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                            {user.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleVerify(user)}
                                            className={`transition-all p-1 rounded-lg ${user.verified ? 'text-teal-600 bg-teal-50' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-100'}`}
                                            title={user.verified ? 'Verified Account' : 'Mark as Verified'}
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                                title="View Detail"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-2 rounded-lg transition-all ${user.status !== 'blocked'
                                                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                    }`}
                                                title={user.status !== 'blocked' ? 'Block User' : 'Unblock User'}
                                            >
                                                {user.status !== 'blocked' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified) */}
                <div className="bg-white px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Total Pool: <span className="text-gray-900">{filteredUsers.length} MEMBERS</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button disabled className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-gray-200 rounded-xl disabled:opacity-30">Prev</button>
                        <button disabled className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-600/20">Next</button>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">User Dossier</h3>
                            <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-3xl bg-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-teal-600/30">
                                    {selectedUser.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-gray-900 leading-none mb-2">{selectedUser.full_name || 'Anonymous'}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${selectedUser.role === 'worker' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {selectedUser.role}
                                        </span>
                                        {selectedUser.verified && <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> Verified
                                        </span>}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Electronic Mail</p>
                                    <p className="text-sm font-bold text-gray-900 break-all">{selectedUser.email || 'Not Provided'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Contact</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedUser.phone || 'Not Provided'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registered Area</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedUser.city || 'Unknown'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registration Date</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'Unknown'}</p>
                                </div>
                            </div>

                            {selectedUser.bio && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Profile Biography</p>
                                    <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedUser.bio}"</p>
                                </div>
                            )}
                        </div>
                        <div className="px-8 py-6 bg-gray-50 flex gap-4">
                            <button
                                onClick={() => handleToggleVerify(selectedUser)}
                                className={`flex-1 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${selectedUser.verified ? 'bg-white text-gray-400 border border-gray-200' : 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'}`}
                            >
                                {selectedUser.verified ? 'Revoke Verify' : 'Verify Identity'}
                            </button>
                            <button
                                onClick={() => handleToggleStatus(selectedUser)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${selectedUser.status !== 'blocked' ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white' : 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                    }`}
                            >
                                {selectedUser.status !== 'blocked' ? 'Suspend Account' : 'Reactivate User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;
