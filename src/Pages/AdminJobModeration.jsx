import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Eye,
    Briefcase,
    MapPin,
    Clock,
    AlertTriangle,
    Flag,
    MoreVertical,
    Check,
    X,
    Trash2
} from 'lucide-react';
import { base44 } from '../api/base44Client';

const AdminJobModeration = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const allJobs = await base44.dbRead('jobs') || {};
            const jobList = Object.values(allJobs).map(j => ({
                ...j,
                employer: j.employer_name || 'Anonymous Employer'
            }));
            setJobs(jobList);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.employer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAction = async (jobId, newStatus) => {
        try {
            await base44.entities.Job.update(jobId, { status: newStatus });
            setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
        } catch (err) {
            alert("Failed to update job status");
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to permanently delete this job listing?")) return;
        try {
            await base44.entities.Job.delete(jobId);
            setJobs(jobs.filter(job => job.id !== jobId));
        } catch (err) {
            alert("Failed to delete job");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Moderation Queue</h1>
                    <p className="text-gray-500 text-sm">Review, approve, or flag job postings to maintain platform quality.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, employer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-500 outline-none w-72 transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
                    >
                        <option value="all">Everything</option>
                        <option value="pending">Needs Review</option>
                        <option value="approved">Approved</option>
                        <option value="flagged">Flagged</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Jobs Queue */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="bg-white p-16 text-center rounded-3xl border border-gray-100">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Scanning Database...</p>
                        </div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white p-16 text-center rounded-3xl border border-gray-100">
                        <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No listings in this queue.</p>
                    </div>
                ) : filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:border-teal-100 transition-all group relative overflow-hidden">
                        {job.status === 'flagged' && <div className="absolute top-0 right-0 px-4 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-xl flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Flagged for Review
                        </div>}

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                                <div className={`p-5 rounded-2xl shadow-inner shrink-0 ${job.status === 'flagged' ? 'bg-red-50 text-red-600' :
                                    job.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                        'bg-teal-50 text-teal-600'
                                    }`}>
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <div className="space-y-2 min-w-0">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-teal-700 transition-colors truncate">{job.title}</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Ref ID: {job.id.substring(0, 12)}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase rounded-lg border border-teal-100">{job.category}</span>
                                        <span className="text-gray-200">|</span>
                                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location || 'Pan Ranchi'}
                                        </span>
                                        <span className="text-gray-200">|</span>
                                        <span className="text-xs font-bold text-gray-900 border-b-2 border-amber-200">{job.salary || 'Fixed Pay'}</span>
                                        <span className="text-gray-200">|</span>
                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> {job.created_at ? new Date(job.created_at).toLocaleString() : 'Just now'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">Origin: <span className="text-gray-900 font-black underline decoration-teal-500/30 underline-offset-2">{job.employer}</span></p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 lg:self-center shrink-0">
                                {job.status === 'pending' || job.status === 'flagged' ? (
                                    <>
                                        <button
                                            onClick={() => handleAction(job.id, 'active')}
                                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all active:scale-95"
                                        >
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(job.id, 'rejected')}
                                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                                        >
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest border ${job.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                        {job.status}
                                    </span>
                                )}
                                <div className="h-10 w-px bg-gray-100 hidden lg:block mx-2"></div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAction(job.id, 'flagged')}
                                        className={`p-3 rounded-xl transition-all ${job.status === 'flagged' ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                        title="Flag Listing"
                                    >
                                        <Flag className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        title="Purge Listing"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminJobModeration;
