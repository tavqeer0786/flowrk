import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Power,
    Globe,
    Search,
    Phone,
    Mail,
    Shield,
    Save,
    AlertCircle,
    CheckCircle2,
    Database,
    Lock,
    Loader2
} from 'lucide-react';
import { base44 } from '../api/base44Client';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        site_name: 'Flowrk.in',
        maintenance_mode: false,
        allow_new_registrations: true,
        contact_email: 'flowrk66@gmail.com',
        contact_phone: '+917209394252',
        seo_title: "Flowrk - India's Trusted Hyperlocal Work Platform",
        seo_description: "Find and offer local work in your area instantly.",
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const dbSettings = await base44.dbRead('settings') || {};
                setSettings(prev => ({
                    ...prev,
                    ...dbSettings
                }));
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await base44.dbWrite('settings', settings);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            alert("Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    const SettingSection = ({ title, icon: Icon, children }) => (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8 transition-all hover:border-teal-100 relative">
            <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-gray-100">
                    <Icon className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">{title}</h3>
            </div>
            <div className="p-8">{children}</div>
        </div>
    );

    const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
        <div className="space-y-2 flex-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                className="w-full bg-gray-50/30 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                placeholder={placeholder}
            />
        </div>
    );

    const ToggleField = ({ label, description, checked, onChange }) => (
        <div className="flex items-center justify-between group py-2">
            <div className="space-y-1">
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{label}</p>
                <p className="text-xs text-gray-400 font-medium max-w-md">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all focus:outline-none ring-offset-2 ring-teal-500/20 focus:ring-4 ${checked ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
            >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-8' : 'translate-x-1'
                    }`} />
            </button>
        </div>
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-none mb-3">Kernel Configuration</h1>
                    <p className="text-gray-500 text-sm font-medium">Control the core engine variables and security protocols of the platform.</p>
                </div>
                {showSuccess && (
                    <div className="bg-teal-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-right-4 shadow-xl shadow-teal-600/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kernel Synced</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center">
                    <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accessing Kernel Registry...</p>
                </div>
            ) : (
                <>
                    <SettingSection title="Global Toggles" icon={Power}>
                        <div className="space-y-8">
                            <ToggleField
                                label="Maintenance Mode"
                                description="Instantly block all non-privileged traffic with a service unavailable screen."
                                checked={settings.maintenance_mode}
                                onChange={(val) => setSettings({ ...settings, maintenance_mode: val })}
                            />
                            <div className="h-px bg-gray-50"></div>
                            <ToggleField
                                label="Identity Enrolment"
                                description="Toggle the ability for new worker and employer profiles to be registered on the cluster."
                                checked={settings.allow_new_registrations}
                                onChange={(val) => setSettings({ ...settings, allow_new_registrations: val })}
                            />
                        </div>
                    </SettingSection>

                    <SettingSection title="Communication Endpoints" icon={Mail}>
                        <div className="flex flex-col md:flex-row gap-8">
                            <InputField
                                label="Primary System Email"
                                value={settings.contact_email}
                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                            />
                            <InputField
                                label="Emergency Support Line"
                                value={settings.contact_phone}
                                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                            />
                        </div>
                    </SettingSection>

                    <SettingSection title="Public Meta Data" icon={Globe}>
                        <div className="space-y-8">
                            <InputField
                                label="Search Engine Title"
                                value={settings.seo_title}
                                onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                            />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Crawler Description</label>
                                <textarea
                                    value={settings.seo_description || ''}
                                    onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                                    className="w-full bg-gray-50/30 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-gray-800 h-32 resize-none"
                                />
                            </div>
                        </div>
                    </SettingSection>

                    <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl flex gap-6 items-start">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-rose-100">
                            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-black text-rose-900 uppercase tracking-widest text-xs">Terminal Warning: Data Integrity</h4>
                            <p className="text-sm text-rose-800 opacity-80 font-medium">Operation in this zone requires high-level clearance. Database purges are non-reversible and destructive.</p>
                            <div className="flex gap-4 pt-4">
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">
                                    <Database className="w-4 h-4" /> Reset Heatmap
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-all">
                                    <Lock className="w-4 h-4" /> Flush Logs
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 flex justify-center">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-4 bg-teal-600 text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-teal-800 transition-all shadow-2xl shadow-teal-600/40 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Commit Configuration Changes
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminSettings;
