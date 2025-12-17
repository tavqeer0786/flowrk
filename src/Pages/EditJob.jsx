import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, MapPin, IndianRupee, Phone, Clock, FileText, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { categoryLabels } from '@/components/ui/CategoryCard';
import { Link } from 'react-router-dom';

const timingOptions = [
  { value: 'Full Day', label: 'Full Day (पूरा दिन)' },
  { value: 'Part Time', label: 'Part Time (आधा दिन)' },
  { value: 'Morning Only', label: 'Morning Only (सुबह)' },
  { value: 'Evening Only', label: 'Evening Only (शाम)' },
  { value: 'Flexible', label: 'Flexible (जैसा सूट हो)' }
];

export default function EditJob() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    payment: '',
    city: '',
    area: '',
    whatsapp: '',
    timing: 'Full Day',
    requirements: ''
  });

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const jobs = await base44.entities.Job.filter({ id: jobId });
      return jobs?.[0] || null;
    },
    enabled: !!jobId
  });

  useEffect(() => {
    if (job) {
      setFormData({
        category: job.category || '',
        title: job.title || '',
        description: job.description || '',
        payment: job.payment?.replace(/[₹\/dayhour]/g, '').trim() || '',
        city: job.city || '',
        area: job.area || '',
        whatsapp: job.whatsapp || '',
        timing: job.timing || 'Full Day',
        requirements: job.requirements || ''
      });
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await base44.entities.Job.update(jobId, {
        ...formData,
        payment: formData.payment.includes('₹') ? formData.payment : `₹${formData.payment}`
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl('EmployerDashboard'));
      }, 1500);
    } catch (error) {
      console.error('Error updating job:', error);
    }
    
    setIsLoading(false);
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Updated!</h2>
          <p className="text-gray-600">Changes saved successfully</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to={createPageUrl('EmployerDashboard')} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-2xl shadow-gray-200/50 border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Edit className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Job Edit Karo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Category choose karo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Painter Chahiye"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="min-h-[120px] rounded-xl"
                  />
                </div>

                {/* Payment */}
                <div className="space-y-2">
                  <Label>Payment (₹) *</Label>
                  <Input
                    placeholder="e.g., 500/day"
                    value={formData.payment}
                    onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Timing */}
                <div className="space-y-2">
                  <Label>Timing</Label>
                  <Select
                    value={formData.timing}
                    onValueChange={(value) => setFormData({ ...formData, timing: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timingOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Area *</Label>
                    <Input
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label>WhatsApp Number *</Label>
                  <Input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label>Special Requirements</Label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="min-h-[80px] rounded-xl"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(createPageUrl('EmployerDashboard'))}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}