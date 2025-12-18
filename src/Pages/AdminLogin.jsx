import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { base44 } from '../api/base44Client';

const AdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = async () => {
        setLoading(true);
        setError('');
        try {
            // First Login with Google
            const user = await base44.auth.loginWithGoogle();

            // Then Check if the user is in the 'admins' node
            const isAdmin = await base44.auth.isAdmin();

            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                // Not an admin - Logout and show error
                await base44.auth.logout();
                setError('Access Denied: You do not have administrative privileges.');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-teal-600 p-3 rounded-2xl shadow-lg ring-4 ring-teal-500/20">
                        <Shield className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Flowrk Admin <span className="text-teal-500">Portal</span>
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Secure login for platform administrators
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-700">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <button
                            onClick={handleAdminLogin}
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax/google.svg" alt="Google" className="w-5 h-5" />
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-500">Security Requirement</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <Lock className="w-4 h-4 text-teal-500" />
                            <p>Administrative access is strictly logged and monitored for security purposes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
