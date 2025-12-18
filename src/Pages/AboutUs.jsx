import React from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Building2, Users, Shield, Zap, Target, Heart, Mail, Phone, MapPin } from 'lucide-react';
import SEO from '@/components/SEO';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="About Us"
                description="Learn more about Flowrk.in, India's first hyperlocal work platform. Our mission is to empower local talent and small businesses through direct connections and commission-free work."
                keywords="about Flowrk, local work platform mission, hyperlocal jobs India"
            />
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    About <span className="text-teal-600">Flowrk.in</span>
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                    Empowering Local Work
                </p>
                <div className="mt-8 prose prose-lg mx-auto text-gray-600">
                    <p>
                        Flowrk.in is India's first hyperlocal work platform that provides a simple, safe, and reliable solution for people to instantly find and offer work in their area. Our core mission is to ensure every Indian gets employment and earning opportunities, whether they are daily wage workers, part-time freelancers, or small business owners.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-16">

                {/* Vision Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Target className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                    </div>
                    <Card className="bg-white shadow-sm border-teal-100">
                        <CardContent className="p-8">
                            <p className="text-gray-600 mb-6">
                                Employment opportunities in India are highly fragmented. Many people rely on agents, WhatsApp groups, and local postings for short-term or daily work, which increases the risk of scams and delays. Flowrk.in's vision is to remove these barriers and create a trusted local work ecosystem through technology.
                            </p>
                            <p className="text-gray-600 mb-4">
                                We believe that employment is not just a source of income, but a tool for dignity and self-reliance. That’s why our platform is easy-to-use and transparent for every user, where:
                            </p>
                            <ul className="grid gap-4 md:grid-cols-3 mt-6">
                                <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Badge variant="outline" className="mt-1 bg-white">1</Badge>
                                    <span className="text-sm text-gray-700">Workers can find work based on their skills and location</span>
                                </li>
                                <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Badge variant="outline" className="mt-1 bg-white">2</Badge>
                                    <span className="text-sm text-gray-700">Employers can hire the right talent for their local businesses or events</span>
                                </li>
                                <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Badge variant="outline" className="mt-1 bg-white">3</Badge>
                                    <span className="text-sm text-gray-700">Both parties can communicate directly without any middleman</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* Mission Section */}
                <section className="bg-teal-900 text-white rounded-3xl p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-teal-800 rounded-lg">
                            <Zap className="w-6 h-6 text-teal-400" />
                        </div>
                        <h2 className="text-3xl font-bold">Our Mission</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl text-teal-400">Making Local Jobs Accessible</h3>
                            <p className="text-teal-100">Providing every user with real-time access to available jobs in their city and neighborhood.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl text-teal-400">Simplified Work Posting</h3>
                            <p className="text-teal-100">The job posting process should be simple and fast for employers, allowing them to hire talent for their urgent needs.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl text-teal-400">Safe & Transparent System</h3>
                            <p className="text-teal-100">Eliminating fake job postings, scams, and extra charges. Providing users with verified contacts and safety guidelines.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl text-teal-400">Empowering Communities</h3>
                            <p className="text-teal-100">We believe that local employment leads to both economic growth and community development.</p>
                        </div>
                    </div>
                </section>

                {/* What We Offer */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Building2 className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Flowrk.in offers users multiple features that make their employment journey smooth:
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "Hyperlocal Job Listings", desc: "City and area-wise job listings so workers can apply for nearby jobs." },
                            { title: "Skills-Based Matching", desc: "Workers select their skills, and the platform suggests relevant jobs to them." },
                            { title: "Dual Functionality", desc: "Both workers and employers can search for jobs and post them." },
                            { title: "Direct Communication", desc: "Direct communication via WhatsApp or platform chat, without any fees or agents." },
                            { title: "Safety & Trust", desc: "Fake job reporting, verified employer badges, and transparent guidelines." }
                        ].map((item, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-2 text-teal-700">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Our Journey */}
                <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
                    <div className="space-y-6 text-gray-600">
                        <p>
                            The idea for Flowrk.in came when we noticed that millions of workers in India depend on unreliable methods to find daily jobs. Jobs are scattered and inconsistent in WhatsApp groups and with local agents. We decided to build a centralized, reliable, and user-friendly platform that empowers every user.
                        </p>
                        <div className="pl-4 border-l-4 border-teal-500 space-y-2">
                            <p className="font-medium text-gray-900">We developed the initial MVP which included:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Separate registration process for Workers and Employers</li>
                                <li>Simple forms for job posting and applications</li>
                                <li>Location and skills-based filters</li>
                                <li>Real-time job feed (future-ready with Firebase)</li>
                            </ul>
                        </div>
                        <p>
                            In Phase 2, we added Freelancer and dual-role functionality, so any user can access both online and offline types of work.
                        </p>
                    </div>
                </section>

                {/* Our Values */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Heart className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { title: "Trust", desc: "Providing a verified and safe environment for every user." },
                            { title: "Accessibility", desc: "Simple interface and mobile-first design for everyone." },
                            { title: "Empowerment", desc: "Providing a platform for growth and earning to local workers and small businesses." },
                            { title: "Innovation", desc: "Using technology to build a hyperlocal work ecosystem." },
                            { title: "Community", desc: "Encouraging collaboration and support among users." }
                        ].map((item, index) => (
                            <div key={index} className="bg-teal-50/50 p-4 rounded-xl text-center">
                                <h3 className="font-bold text-teal-800 mb-2">{item.title}</h3>
                                <p className="text-xs text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold mb-8">Why Choose Flowrk.in</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {["Find work without a resume or agent", "Quick job posting and application process",
                            "Verified contacts and safety guidelines", "Skills-based matching and notifications",
                            "Mobile-friendly and responsive interface"].map((text, i) => (
                                <div key={i} className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
                                    <CheckCircleIcon className="w-5 h-5 text-teal-400 flex-shrink-0" />
                                    <span className="text-sm text-left">{text}</span>
                                </div>
                            ))}
                    </div>
                    <p className="mt-8 text-gray-400 italic">
                        "Flowrk.in is not just a job portal, but India's first hyperlocal work ecosystem where every user can shape their future according to their skills and opportunities."
                    </p>
                </section>

                {/* Contact Us */}
                <section id="contact" className="scroll-mt-20">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12 text-white">
                            <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
                            <p className="text-teal-100 mb-8">At Flowrk.in, we value every user's feedback and query.</p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Mail className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2">Email</h3>
                                    <a href="mailto:flowrk66@gmail.com" className="hover:underline">flowrk66@gmail.com</a>
                                </div>
                                <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Phone className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2">Phone / WhatsApp</h3>
                                    <a href="tel:+917209394252" className="hover:underline">+91-7209394252</a>
                                </div>
                                <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <MapPin className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2">Office Address</h3>
                                    <p>Lalpur-Ranchi-Jharkhand-India</p>
                                </div>
                            </div>
                            <p className="text-center mt-8 text-sm text-teal-200">
                                We ensure that your query is responded to within 24–48 hours.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </div>

    );
}

function CheckCircleIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
