import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, MessageSquare, Users, Briefcase, Info, CheckCircle } from 'lucide-react';

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Form Submitted:', formData);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Get in Touch with <span className="text-teal-600">Flowrk.in</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Flowrk.in par hum har user ka feedback aur query value karte hain. Humari team ready hai aapke questions, suggestions aur technical issues ko solve karne ke liye.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Contact Info & Why Contact Us */}
                    <div className="space-y-8">
                        {/* Reach Out Section */}
                        <Card className="shadow-lg border-teal-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <Mail className="w-6 h-6 text-teal-600" />
                                    Reach Out to Us
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-gray-600">Aap humse multiple ways me contact kar sakte hain:</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg">
                                        <div className="bg-white p-2 rounded-full shadow-sm">
                                            <Mail className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-teal-600 font-semibold uppercase">Email</p>
                                            <a href="mailto:support@flowrk.in" className="text-gray-900 font-medium hover:underline">support@flowrk.in</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg">
                                        <div className="bg-white p-2 rounded-full shadow-sm">
                                            <Phone className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-teal-600 font-semibold uppercase">Phone / WhatsApp</p>
                                            <a href="tel:+917209394252" className="text-gray-900 font-medium hover:underline">+91-7209394252</a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg">
                                        <div className="bg-white p-2 rounded-full shadow-sm">
                                            <MapPin className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-teal-600 font-semibold uppercase">Office Address</p>
                                            <p className="text-gray-900 font-medium">Lalpur-Ranchi-Jharkhand-India</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-center text-gray-500 bg-gray-50 py-2 rounded-full">
                                    Hum ensure karte hain ki aapka query 24–48 hours ke andar respond ho.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Why Contact Us */}
                        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Contact Us?</h2>
                            <div className="grid gap-6">
                                {[
                                    { icon: Info, title: "Support", desc: "Technical issues ya website related problems report karein." },
                                    { icon: MessageSquare, title: "Feedback", desc: "Features aur UX improvement suggestions share karein." },
                                    { icon: Users, title: "Partnerships", desc: "Local businesses, NGOs, or freelancers ke liye collaboration." },
                                    { icon: Briefcase, title: "Job Post Help", desc: "Agar aapko kaam post karne me help chahiye." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1">
                                            <item.icon className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="space-y-8">
                        <Card className="shadow-lg border-teal-100">
                            <CardHeader>
                                <CardTitle className="text-2xl">Contact Form</CardTitle>
                                <p className="text-gray-500 text-sm">Hum recommend karte hain ki aap form ke through bhi contact karein.</p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject / Topic</Label>
                                        <Input
                                            id="subject"
                                            placeholder="What is this regarding?"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Type your message here..."
                                            className="min-h-[150px]"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg">
                                        {isSubmitted ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Message Sent!
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>

                                {/* Benefits */}
                                <div className="mt-8 pt-8 border-t">
                                    <h4 className="font-semibold text-gray-900 mb-4">Benefits of Using Contact Form:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Direct query tracking
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Fast response from support team
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" /> Feedback helps improve platform
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Promise Section */}
                        <div className="bg-teal-900 text-white p-8 rounded-xl text-center">
                            <h2 className="text-xl font-bold mb-4">Our Promise</h2>
                            <p className="text-teal-100 mb-6">
                                Flowrk.in me user satisfaction aur trust humari priority hai. Humari team friendly, responsive aur proactive hai, aur hum ensure karte hain ki aapke messages ka response timely ho.
                            </p>
                        </div>

                        {/* Closing */}
                        <div className="bg-gray-100 p-6 rounded-xl text-center">
                            <p className="text-gray-600 text-sm">
                                Flowrk.in ke About Us aur Contact Us pages users ko platform ke mission, vision aur support system ke baare me clear idea dete hain. Humari goal hai ki har Indian ko employment aur earning ka mauka mile, aur aapke feedback ke zariye hum apni services aur better banate rahein.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
