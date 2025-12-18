import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, ShieldAlert, FileText, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '@/components/SEO';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Privacy Policy"
                description="Our privacy policy explains how Flowrk.in collects and protects your data. We ensure your information is safe and used only to connect you with work."
                keywords="privacy policy Flowrk.in, data protection job site, user privacy India"
            />
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Privacy <span className="text-teal-600">Policy</span>
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                    At Flowrk.in, your privacy is our priority.
                </p>
                <div className="mt-8 prose prose-lg mx-auto text-gray-600">
                    <p>
                        This Privacy Policy describes how Flowrk.in ("we", "us", or "our") collects, uses, and shares your personal information when you use our platform. By using Flowrk.in, you agree to the practices described in this policy.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Information Collection */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Eye className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                    </div>
                    <Card className="bg-white shadow-sm border-teal-100">
                        <CardContent className="p-8 space-y-4">
                            <p className="text-gray-600">
                                We collect information to provide a better service to our users. This includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-gray-600">
                                <li><strong>Profile Information:</strong> When you register as a worker or employer, we collect your name, phone number, city, area, and skills/requirements.</li>
                                <li><strong>Usage Data:</strong> We may collect information about how you interact with our platform, such as the jobs you view or post.</li>
                                <li><strong>Device Information:</strong> We may collect information about the device you use to access Flowrk.in, including IP address and browser type.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* Data Usage */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Lock className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">How We Use Your Data</h2>
                    </div>
                    <Card className="bg-white shadow-sm border-teal-100">
                        <CardContent className="p-8 space-y-4">
                            <p className="text-gray-600">
                                Your data is used for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-gray-600">
                                <li><strong>Connecting Workers and Employers:</strong> To help users find work or hire talent in their local area.</li>
                                <li><strong>Improving Our Services:</strong> To analyze platform usage and enhance our features.</li>
                                <li><strong>Communication:</strong> To send you updates, safety tips, and relevant notifications.</li>
                                <li><strong>Safety and Security:</strong> To prevent fraud, reports fake jobs, and ensure a safe ecosystem.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* Third-Party Services */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <ShieldAlert className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Sharing Your Information</h2>
                    </div>
                    <Card className="bg-white shadow-sm border-teal-100">
                        <CardContent className="p-8">
                            <p className="text-gray-600">
                                We do not sell your personal data. However, your contact information (like phone number) is shared with other users on the platform to facilitate direct communication for work purposes. We may also share data with third-party service providers (like Firebase for hosting) who help us operate our platform.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Security Measures */}
                <section className="bg-teal-900 text-white rounded-3xl p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-teal-800 rounded-lg">
                            <Shield className="w-6 h-6 text-teal-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Security</h2>
                    </div>
                    <p className="text-teal-100 mb-6">
                        We take reasonable measures to protect your personal information from unauthorized access, loss, or misuse. However, please remember that no method of transmission over the internet is 100% secure.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h3 className="font-semibold text-teal-400 mb-2">Encrypted Data</h3>
                            <p className="text-sm text-teal-100">We use industry-standard encryption for data storage and transmission.</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                            <h3 className="font-semibold text-teal-400 mb-2">Access Control</h3>
                            <p className="text-sm text-teal-100">Restricted access to user data for our internal team.</p>
                        </div>
                    </div>
                </section>

                {/* User Rights */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <FileText className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                    </div>
                    <Card className="bg-white shadow-sm border-teal-100">
                        <CardContent className="p-8">
                            <p className="text-gray-600 mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>Access and view the personal information we hold about you.</li>
                                <li>Request corrections to any inaccurate or incomplete data.</li>
                                <li>Request the deletion of your account and personal information.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* Contact Us */}
                <section className="scroll-mt-20">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12 text-white">
                            <h2 className="text-2xl font-bold mb-6">Contact Us About Privacy</h2>
                            <p className="text-teal-100 mb-8">If you have any questions or concerns about this Privacy Policy, please contact us.</p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Mail className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2">Email</h3>
                                    <a href="mailto:flowrk66@gmail.com" className="hover:underline">flowrk66@gmail.com</a>
                                </div>
                                <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Phone className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2">WhatsApp</h3>
                                    <a href="https://wa.me/917209394252" className="hover:underline">+91-7209394252</a>
                                </div>
                                <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <MapPin className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2">Office Address</h3>
                                    <p className="text-sm">Lalpur, Ranchi, Jharkhand, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <p className="text-center text-sm text-gray-500 pt-8">
                    Last Updated: December 2024
                </p>
            </div>
        </div>
    );
}
