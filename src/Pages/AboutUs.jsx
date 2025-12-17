import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Shield, Zap, Target, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                        Flowrk.in India ka pehla hyperlocal work platform hai jo logon ko unke area me turant kaam dhoondhne aur dene ka ek simple, safe, aur reliable solution provide karta hai. Humara core mission hai ki har Indian ko employment aur earning ka mauka mile, chahe wo daily wage worker ho, part-time freelancer ho, ya small business owner.
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
                                Rozgar ki opportunities India me bahut fragmented hain. Bahut log short-term ya daily work ke liye agents, WhatsApp groups, aur local postings par rely karte hain, jisse scams aur delays ka risk badh jata hai. Flowrk.in ka vision hai ki ye barriers remove kiye jayein aur technology ke zariye ek trusted local work ecosystem create ho.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Hum believe karte hain ki rozgar sirf ek income source nahi, balki dignity aur self-reliance ka tool hai. Isliye humari platform har user ke liye easy-to-use aur transparent hai, jahan:
                            </p>
                            <ul className="grid gap-4 md:grid-cols-3 mt-6">
                                <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Badge variant="outline" className="mt-1 bg-white">1</Badge>
                                    <span className="text-sm text-gray-700">Workers apne skills aur location ke hisaab se kaam dhundh sakte hain</span>
                                </li>
                                <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Badge variant="outline" className="mt-1 bg-white">2</Badge>
                                    <span className="text-sm text-gray-700">Employers apne local business ya events ke liye right talent hire kar sakte hain</span>
                                </li>
                                <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Badge variant="outline" className="mt-1 bg-white">3</Badge>
                                    <span className="text-sm text-gray-700">Dono parties directly communicate kar sakti hain bina kisi middleman ke</span>
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
                            <h3 className="font-semibold text-xl text-teal-400">Local Jobs Accessible Karna</h3>
                            <p className="text-teal-100">Har user ko apne city aur neighborhood me available jobs ka real-time access provide karna.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl text-teal-400">Simplified Work Posting</h3>
                            <p className="text-teal-100">Employers ke liye job posting process simple aur fast hona chahiye, taki wo apne urgent needs ke liye talent hire kar saken.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl text-teal-400">Safe & Transparent System</h3>
                            <p className="text-teal-100">Fake job postings, scams aur extra charges ko eliminate karna. Users ko verified contacts aur safety guidelines provide karna.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl text-teal-400">Empowering Communities</h3>
                            <p className="text-teal-100">Hum believe karte hain ki local employment se economic growth aur community development dono hoti hain.</p>
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
                        Flowrk.in pe users ko multiple features milte hain jo unki employment journey ko smooth banate hain:
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "Hyperlocal Job Listings", desc: "City aur area-wise job listings jisse workers nearby jobs apply kar saken." },
                            { title: "Skills-Based Matching", desc: "Workers apne skills select karte hain aur platform unko relevant jobs suggest karta hai." },
                            { title: "Dual Functionality", desc: "Worker ya Employer, dono roles ke users jobs dhundh sakte hain aur post bhi kar sakte hain." },
                            { title: "Direct Communication", desc: "WhatsApp ya platform chat ke zariye direct communication, bina koi fees ya agent ke." },
                            { title: "Safety & Trust", desc: "Fake job reporting, verified employer badges, aur transparent guidelines." }
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
                            Flowrk.in ka idea tab aya jab humne notice kiya ki India me millions of workers daily jobs dhoondhne ke liye unreliable methods pe depend karte hain. WhatsApp groups aur local agents me jobs scattered aur inconsistent hoti hain. Humne decide kiya ki ek centralized, reliable aur user-friendly platform banaya jaye jo har user ko empower kare.
                        </p>
                        <div className="pl-4 border-l-4 border-teal-500 space-y-2">
                            <p className="font-medium text-gray-900">Humne initial MVP develop kiya jisme:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Workers aur Employers ke liye separate registration process</li>
                                <li>Job posting aur job application ka simple form</li>
                                <li>Location aur skills based filters</li>
                                <li>Real-time job feed (localStorage / Base44 / Firebase future-ready)</li>
                            </ul>
                        </div>
                        <p>
                            Phase 2 me, humne Freelancers aur dual-role functionality add ki, taki koi bhi user online aur offline dono types of work access kar sake.
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
                            { title: "Trust", desc: "Har user ko verified aur safe environment provide karna." },
                            { title: "Accessibility", desc: "Simple interface aur mobile-first design har user ke liye." },
                            { title: "Empowerment", desc: "Local workers aur small businesses ko growth aur earning ka platform provide karna." },
                            { title: "Innovation", desc: "Technology ka use karke hyperlocal work ecosystem banayein." },
                            { title: "Community", desc: "Users ke beech collaboration aur support ko encourage karna." }
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
                        {["Bina resume aur agent ke apna kaam dhundo", "Quick job posting aur application process",
                            "Verified contacts aur safety guidelines", "Skills-based matching aur notifications",
                            "Mobile-friendly aur responsive interface"].map((text, i) => (
                                <div key={i} className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
                                    <CheckCircleIcon className="w-5 h-5 text-teal-400 flex-shrink-0" />
                                    <span className="text-sm text-left">{text}</span>
                                </div>
                            ))}
                    </div>
                    <p className="mt-8 text-gray-400 italic">
                        "Flowrk.in sirf ek job portal nahi, balki India ka first hyperlocal work ecosystem hai jahan har user apne skills aur opportunities ke hisaab se apna future shape kar sakta hai."
                    </p>
                </section>

                {/* Contact Us */}
                <section id="contact" className="scroll-mt-20">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12 text-white">
                            <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
                            <p className="text-teal-100 mb-8">Flowrk.in par hum har user ka feedback aur query value karte hain.</p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="flex flex-col items-center text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Mail className="w-8 h-8 mb-4" />
                                    <h3 className="font-bold mb-2">Email</h3>
                                    <a href="mailto:support@flowrk.in" className="hover:underline">support@flowrk.in</a>
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
                                Hum ensure karte hain ki aapka query 24–48 hours ke andar respond ho.
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
