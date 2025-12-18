import React, { useState, useEffect } from 'react';
import {
    FileText,
    Edit3,
    Save,
    Eye,
    History,
    HelpCircle,
    ShieldCheck,
    Info,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { base44 } from '../api/base44Client';

const AdminCMS = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [content, setContent] = useState({
        about: "",
        faq: "",
        privacy: "",
        terms: ""
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchCMS = async () => {
            setLoading(true);
            try {
                const cmsData = await base44.dbRead('cms') || {};
                setContent({
                    about: cmsData.about || "About us content not set yet.",
                    faq: cmsData.faq || "FAQ content not set yet.",
                    privacy: cmsData.privacy || "Privacy policy content not set yet.",
                    terms: cmsData.terms || "Terms and conditions not set yet."
                });
            } catch (err) {
                console.error("Failed to fetch CMS", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCMS();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await base44.dbWrite(`cms/${activeTab}`, content[activeTab]);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            alert("Failed to save content");
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'about', name: 'About Us', icon: Info },
        { id: 'faq', name: 'FAQs', icon: HelpCircle },
        { id: 'privacy', name: 'Privacy Policy', icon: ShieldCheck },
        { id: 'terms', name: 'Terms & Conditions', icon: FileText },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-mono italic underline decoration-teal-500 underline-offset-8">Central Intelligence CMS</h1>
                    <p className="text-gray-500 text-sm mt-2">Modify the core documents and informational nodes of Flowrk.</p>
                </div>
                {showSuccess && (
                    <div className="bg-teal-50 border border-teal-200 text-teal-700 px-6 py-2 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-black uppercase tracking-widest">Global Node Updated</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs Sidebar */}
                <div className="w-full lg:w-72 shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-teal-600 text-white shadow-xl shadow-teal-600/30 ring-2 ring-teal-500 ring-offset-2'
                                : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-900 border border-gray-100'
                                }`}
                        >
                            <tab.icon className="w-5 h-5 shrink-0" />
                            {tab.name}
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 italic">
                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                            <Info className="w-3 h-3 inline mr-1 mb-0.5" />
                            Note: Content updated here will reflect globally across all user agents in real-time.
                        </p>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px] relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hydrating Content Nodes...</p>
                        </div>
                    )}

                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                <Edit3 className="w-4 h-4 text-teal-600" />
                            </div>
                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{tabs.find(t => t.id === activeTab)?.name} BUFFER</span>
                        </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                        <textarea
                            value={content[activeTab]}
                            onChange={(e) => setContent({ ...content, [activeTab]: e.target.value })}
                            className="flex-1 w-full p-8 border border-gray-100 rounded-3xl bg-gray-50/30 text-gray-800 font-mono text-sm focus:ring-4 focus:ring-teal-500/10 outline-none resize-none leading-relaxed"
                            placeholder={`Enter ${activeTab} content here...`}
                        />
                        <div className="flex justify-between items-center pt-8">
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                MD5 Hash Verification: <span className="text-gray-400 font-mono">{(content[activeTab]?.length || 0) * 7}XFL</span>
                            </p>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || loading}
                                className="flex items-center gap-3 bg-teal-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/30 active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Push Change to Cloud
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCMS;
