import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Shield, AlertTriangle, CheckCircle, Phone, Mail,
  MessageCircle, Loader2, BadgeCheck, XCircle, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const safetyTips = [
  {
    icon: XCircle,
    title: 'Never Pay in Advance',
    description: 'Never pay anyone in advance. Inspect the work first, then make the payment.',
    color: 'text-red-500 bg-red-100'
  },
  {
    icon: Phone,
    title: 'Verify via Phone',
    description: 'Talk to the employer on the phone before applying for a job. Confirm the details.',
    color: 'text-blue-500 bg-blue-100'
  },
  {
    icon: BadgeCheck,
    title: "Don't Share Documents",
    description: 'Do not share personal documents like Aadhar or PAN with strangers.',
    color: 'text-violet-500 bg-violet-100'
  },
  {
    icon: Info,
    title: 'Understand Job Details Clearly',
    description: 'Understand payment, timing, and work details clearly beforehand.',
    color: 'text-teal-500 bg-teal-100'
  }
];

export default function Safety() {
  const [reportData, setReportData] = useState({
    job_description: '',
    employer_name: '',
    contact_number: '',
    reason: '',
    your_contact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Safety & Trust"
        description="Stay safe while finding local work. Learn how to identify fake jobs, verify employers, and report suspicious listings on Flowrk.in."
        keywords="job safety, report fake jobs, verify employer, safe hiring India"
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Safety & Trust
          </h1>
          <p className="text-red-100 text-lg max-w-xl mx-auto">
            Your safety is our priority. Report fake jobs and stay safe.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Safety Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Safety Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {safetyTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${tip.color} flex items-center justify-center mb-4`}>
                      <tip.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-600 text-sm">{tip.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Report Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Report Fake Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Report Submitted Successfully!</h3>
                  <p className="text-gray-600">We will take action within 24 hours. Thank you!</p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setReportData({
                        job_description: '',
                        employer_name: '',
                        contact_number: '',
                        reason: '',
                        your_contact: ''
                      });
                    }}
                    className="mt-4"
                    variant="outline"
                  >
                    New Report
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="job_description">Job Description (Which Job?)</Label>
                    <Textarea
                      id="job_description"
                      placeholder="Tell us about the job..."
                      value={reportData.job_description}
                      onChange={(e) => setReportData({ ...reportData, job_description: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employer_name">Employer/Company Name</Label>
                      <Input
                        id="employer_name"
                        placeholder="Tell us the name"
                        value={reportData.employer_name}
                        onChange={(e) => setReportData({ ...reportData, employer_name: e.target.value })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_number">Their Contact Number</Label>
                      <Input
                        id="contact_number"
                        placeholder="Phone number"
                        value={reportData.contact_number}
                        onChange={(e) => setReportData({ ...reportData, contact_number: e.target.value })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">What is the Problem?</Label>
                    <Textarea
                      id="reason"
                      placeholder="Describe in detail what was wrong..."
                      value={reportData.reason}
                      onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                      required
                      className="min-h-[100px] rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="your_contact">Your Contact (Optional)</Label>
                    <Input
                      id="your_contact"
                      placeholder="We will contact you if necessary"
                      value={reportData.your_contact}
                      onChange={(e) => setReportData({ ...reportData, your_contact: e.target.value })}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !reportData.job_description || !reportData.reason}
                    className="w-full h-12 bg-red-600 hover:bg-red-700 rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 mb-4">If you have any problems, contact us directly:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:flowrk66@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-4 h-4" />
              flowrk66@gmail.com
            </a>
            <a
              href="https://wa.me/917209394252"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 hover:bg-green-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Support
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}