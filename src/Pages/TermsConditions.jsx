import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, AlertOctagon, Scale, ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '@/components/SEO';

export default function TermsConditions() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Terms & Conditions"
                description="Read our terms and conditions to understand the rules for using Flowrk.in. We promote a fair, safe, and transparent environment for all users."
                keywords="terms and conditions Flowrk.in, user agreement job platform, legal India work"
            />
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Terms & <span className="text-teal-600">Conditions</span>
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                    Rules and guidelines for using Flowrk.in
                </p>
                <div className="mt-8 prose prose-lg mx-auto text-gray-600">
                    <p>
                        Welcome to Flowrk.in. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Agreement */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Scale className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
                    </div>
                    <Card className="bg-white shadow-sm border-teal-100">
                        <CardContent className="p-8">
                            <p className="text-gray-600">
                                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Flowrk.in ("we", "us", or "our"), concerning your access to and use of our platform. If you do not agree with all of these terms, then you are expressly prohibited from using the site.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* User Responsibilities */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">2. User Responsibilities</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-teal-700 mb-3">For Workers</h3>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                                    <li>Provide accurate skill and location information.</li>
                                    <li>Be professional and punctual when taking up work.</li>
                                    <li>Do not share personal financial details with strangers.</li>
                                    <li>Report any suspicious employer activity.</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="bg-white shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-teal-700 mb-3">For Employers</h3>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                                    <li>Provide clear and honest job descriptions.</li>
                                    <li>Ensure a safe working environment for workers.</li>
                                    <li>Pay the agreed-upon amount after work completion.</li>
                                    <li>No discriminatory or illegal job postings.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Platform Rules */}
                <section className="bg-gray-900 text-white rounded-3xl p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gray-800 rounded-lg">
                            <AlertOctagon className="w-6 h-6 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold">3. Prohibited Activities</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {[
                            "Posting fake jobs or misleading work opportunities.",
                            "Charging workers any registration or 'agent' fees.",
                            "Using the platform for illegal or harmful purposes.",
                            "Attempting to bypass platform guidelines to scam users.",
                            "Harassing or abusing other users of the platform.",
                            "Posting duplicate jobs in multiple areas."
                        ].map((rule, i) => (
                            <div key={i} className="flex gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                <p className="text-sm text-gray-300">{rule}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Payment Disclaimer */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <ShieldAlert className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">4. Payments & Disclaimers</h2>
                    </div>
                    <Card className="bg-white shadow-sm border-teal-100">
                        <CardContent className="p-8 space-y-4">
                            <p className="text-gray-600 font-medium">
                                Flowrk.in is a discovery platform, not a payment gateway.
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-gray-600">
                                <li><strong>Direct Interaction:</strong> We facilitate the connection between workers and employers. All financial transactions are handled directly between the two parties.</li>
                                <li><strong>No Advance Payments:</strong> We strongly advise users NOT to give advance payments to anyone. Flowrk.in is not responsible for any financial losses.</li>
                                <li><strong>Verification:</strong> While we strive for safety, we cannot guarantee the background of every user. Users are advised to exercise caution and perform their own checks.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* Liability */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Limitation of Liability</h2>
                    <Card className="bg-white shadow-sm border-teal-100">
                        <CardContent className="p-8">
                            <p className="text-gray-600">
                                In no event shall Flowrk.in, its founders, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the platform.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Contact */}
                <section className="scroll-mt-20">
                    <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12 text-white">
                            <h2 className="text-2xl font-bold mb-6">Questions?</h2>
                            <p className="text-teal-100 mb-8">If you have any questions regarding these Terms and Conditions, feel free to reach out.</p>

                            <div className="grid md:grid-cols-3 gap-8 text-center">
                                <div className="flex flex-col items-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                    <Mail className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2 text-sm italic">Email</h3>
                                    <a href="mailto:flowrk66@gmail.com" className="text-sm underline">flowrk66@gmail.com</a>
                                </div>
                                <div className="flex flex-col items-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                    <Phone className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2 text-sm italic">Contact</h3>
                                    <a href="tel:+917209394252" className="text-sm underline">+91-7209394252</a>
                                </div>
                                <div className="flex flex-col items-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                    <MapPin className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2 text-sm italic">Office</h3>
                                    <p className="text-xs">Lalpur, Ranchi, Jharkhand, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <p className="text-center text-sm text-gray-500 pt-8 italic">
                    Effective Date: December 2024
                </p>
            </div>
        </div>
    );
}
