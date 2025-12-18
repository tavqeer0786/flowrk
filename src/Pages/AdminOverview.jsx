import React, { useState, useEffect } from 'react';
import {
    Users,
    Briefcase,
    ClipboardList,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MapPin,
    Clock,
    Shield,
    Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { base44 } from '../api/base44Client';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    const colorClasses = {
        teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600' }
    };

    const colors = colorClasses[color] || { bg: 'bg-gray-50', text: 'text-gray-600' };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    <div className="flex items-center gap-1 mt-2">
                        {trend === 'up' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {trendValue}%
                        </span>
                        <span className="text-xs text-gray-400">vs last week</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
            </div>
        </div>
    );
};

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalWorkers: 0,
        totalEmployers: 0,
        activeJobs: 0,
        totalRequests: 0,
        recentJobs: [],
        chartData: [],
        trends: {
            users: { val: 0, dir: 'up' },
            workers: { val: 0, dir: 'up' },
            employers: { val: 0, dir: 'up' },
            jobs: { val: 0, dir: 'up' }
        },
        loading: true
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Workers
                const workers = await base44.dbRead('workers') || {};
                const workerList = Object.values(workers);

                // Fetch Employers
                const employers = await base44.dbRead('employers') || {};
                const employerList = Object.values(employers);

                // Fetch Jobs
                const jobs = await base44.dbRead('jobs') || {};
                const jobList = Object.values(jobs);

                // Calculate Recent Jobs
                const recent = jobList
                    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
                    .slice(0, 5);

                // Process Chart Data & Trends
                const now = new Date();
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

                const getTrend = (list) => {
                    const currentPeriod = list.filter(item => {
                        const date = new Date(item.created_at || 0);
                        return date >= sevenDaysAgo && date <= now;
                    }).length;
                    const previousPeriod = list.filter(item => {
                        const date = new Date(item.created_at || 0);
                        return date >= fourteenDaysAgo && date < sevenDaysAgo;
                    }).length;

                    if (previousPeriod === 0) return { val: currentPeriod > 0 ? 100 : 0, dir: 'up' };
                    const diff = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
                    return {
                        val: Math.abs(Math.round(diff)),
                        dir: diff >= 0 ? 'up' : 'down'
                    };
                };

                // Chart Data (Last 7 Days)
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const last7Days = [];

                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(now.getDate() - i);
                    const dayLabel = days[d.getDay()];
                    const dateStr = d.toISOString().split('T')[0];

                    const dailyUsers = [...workerList, ...employerList].filter(u => {
                        const uDate = u.created_at ? u.created_at.split('T')[0] : '';
                        return uDate === dateStr;
                    }).length;

                    const dailyJobs = jobList.filter(j => {
                        const jDate = j.created_at ? j.created_at.split('T')[0] : '';
                        return jDate === dateStr;
                    }).length;

                    last7Days.push({
                        name: dayLabel,
                        users: dailyUsers,
                        jobs: dailyJobs,
                        date: dateStr
                    });
                }

                setStats({
                    totalUsers: workerList.length + employerList.length,
                    totalWorkers: workerList.length,
                    totalEmployers: employerList.length,
                    activeJobs: jobList.filter(j => j.status === 'open' || j.status === 'approved' || j.status === 'pending' || j.status === 'active').length,
                    totalRequests: jobList.length,
                    recentJobs: recent,
                    chartData: last7Days,
                    trends: {
                        users: getTrend([...workerList, ...employerList]),
                        workers: getTrend(workerList),
                        employers: getTrend(employerList),
                        jobs: getTrend(jobList)
                    },
                    loading: false
                });
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
                setStats(s => ({ ...s, loading: false }));
            }
        };

        fetchDashboardData();
    }, []);

    if (stats.loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm">Welcome back, Admin. Real-time platform data is now synced.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Last Updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Registered"
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend={stats.trends.users.dir}
                    trendValue={stats.trends.users.val}
                    color="teal"
                />
                <StatCard
                    title="Workers"
                    value={stats.totalWorkers.toLocaleString()}
                    icon={Shield}
                    trend={stats.trends.workers.dir}
                    trendValue={stats.trends.workers.val}
                    color="blue"
                />
                <StatCard
                    title="Employers"
                    value={stats.totalEmployers.toLocaleString()}
                    icon={Briefcase}
                    trend={stats.trends.employers.dir}
                    trendValue={stats.trends.employers.val}
                    color="purple"
                />
                <StatCard
                    title="Total Listings"
                    value={stats.totalRequests.toLocaleString()}
                    icon={ClipboardList}
                    trend={stats.trends.jobs.dir}
                    trendValue={stats.trends.jobs.val}
                    color="orange"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Activity Overview</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Daily registration activity (Last 7 Days)</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-1 rounded-lg font-bold">LIVE FEED</span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelClassName="text-white font-mono text-[10px]"
                                />
                                <Area type="monotone" dataKey="users" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Demand Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900">Listing Trends</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">New listings per day</p>
                        </div>
                        <div className="flex gap-4 text-[10px] font-bold text-gray-400">
                            SEVEN DAY WINDOW
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    labelClassName="text-white font-mono text-[10px]"
                                />
                                <Bar dataKey="jobs" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Recent Service Listings</h3>
                        <Link to="/admin/jobs" className="text-xs font-bold text-teal-600 hover:text-teal-700 underline offset-4">View Management Console</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.recentJobs.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-sm text-gray-400 font-medium italic">No jobs have been posted yet.</p>
                            </div>
                        ) : stats.recentJobs.map((job, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                    <Briefcase className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{job.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {job.location || 'All Ranchi'}
                                        </span>
                                        <span className="text-gray-300 mx-1">•</span>
                                        <span className="text-xs text-teal-600 font-bold bg-teal-50 px-1.5 py-0.5 rounded">{job.category}</span>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                                    <p className="text-xs font-bold text-gray-700">{job.employer_name || 'Anonymous'}</p>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(job.created_at || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                    <h3 className="font-bold text-gray-900 mb-6">User Base Mix</h3>
                    <div className="space-y-8">
                        {[
                            { label: 'Workers (Providers)', count: stats.totalWorkers, percentage: (stats.totalWorkers / stats.totalUsers * 100) || 0, color: 'teal' },
                            { label: 'Employers (Seekers)', count: stats.totalEmployers, percentage: (stats.totalEmployers / stats.totalUsers * 100) || 0, color: 'blue' },
                        ].map((loc, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{loc.label}</span>
                                        <span className="text-xl font-bold text-gray-900">{loc.count}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                        {Math.round(loc.percentage)}%
                                    </span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full transition-all duration-1000 ${loc.color === 'teal' ? 'bg-teal-500' : 'bg-blue-500'} rounded-full`}
                                        style={{ width: `${loc.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50">
                        <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100/50">
                            <div className="flex items-center gap-2 text-teal-700 mb-1">
                                <Users className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Growth Ready</span>
                            </div>
                            <p className="text-[10px] text-teal-600 font-medium">Your platform is currently supporting {stats.totalUsers} registered members across Ranchi.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
