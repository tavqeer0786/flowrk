import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, MapPin, IndianRupee, Phone, Clock, FileText, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { categoryLabels } from '@/components/ui/CategoryCard';

const paymentTypes = [
  { value: 'per_day', label: 'Per Day (रोज़ाना)' },
  { value: 'total', label: 'Total (कुल)' },
  { value: 'per_hour', label: 'Per Hour (घंटे के हिसाब)' }
];

const timingOptions = [
  { value: 'Full Day', label: 'Full Day (पूरा दिन)' },
  { value: 'Part Time', label: 'Part Time (आधा दिन)' },
  { value: 'Morning Only', label: 'Morning Only (सुबह)' },
  { value: 'Evening Only', label: 'Evening Only (शाम)' },
  { value: 'Flexible', label: 'Flexible (जैसा सूट हो)' }
];

export default function PostWork() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [employerProfile, setEmployerProfile] = useState(null);
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    payment: '',
    payment_type: 'per_day',
    city: '',
    area: '',
    whatsapp: '',
    timing: 'Full Day',
    requirements: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (!isAuthenticated) {
        base44.auth.redirectToLogin(createPageUrl('PostWork'));
        return;
      }

      const userData = await base44.auth.me();
      setUser(userData);

      // Check for employer profile
      const profiles = await base44.entities.EmployerProfile.filter({ user_id: userData.id });
      if (profiles && profiles.length > 0) {
        setEmployerProfile(profiles[0]);
        // Pre-fill from employer profile
        setFormData(prev => ({
          ...prev,
          city: profiles[0].city || '',
          area: profiles[0].area || '',
          whatsapp: profiles[0].whatsapp || ''
        }));
      } else {
        // No employer profile - redirect to create one
        navigate(createPageUrl('EmployerRegistration'));
        return;
      }

      setCheckingAuth(false);
    } catch (error) {
      console.error('Auth error:', error);
      base44.auth.redirectToLogin(createPageUrl('PostWork'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const paymentText = `₹${formData.payment}${formData.payment_type === 'per_day' ? '/day' : formData.payment_type === 'per_hour' ? '/hour' : ''}`;
      
      await base44.entities.Job.create({
        ...formData,
        payment: paymentText,
        employer_id: user.id,
        employer_name: employerProfile?.name || 'Employer',
        status: 'active'
      });
      
      // Update employer job count
      if (employerProfile) {
        await base44.entities.EmployerProfile.update(employerProfile.id, {
          total_jobs_posted: (employerProfile.total_jobs_posted || 0) + 1
        });
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl('EmployerDashboard'));
      }, 2000);
    } catch (error) {
      console.error('Error posting job:', error);
    }
    
    setIsLoading(false);
  };

  if (checkingAuth) {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
          <p className="text-gray-600">Workers ab aapki job dekh sakte hain</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-2xl shadow-gray-200/50 border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Naya Kaam Post Karo
              </CardTitle>
              <p className="text-gray-500 mt-2">
                Details bharo aur workers dhundho
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-600" />
                    Category *
                  </Label>
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
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Job Title (Optional)
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Painter Chahiye Shop Ke Liye"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Job Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Kaam ke baare mein detail mein likho..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="min-h-[120px] rounded-xl"
                  />
                </div>

                {/* Payment */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-teal-600" />
                      Payment (₹) *
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.payment}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Type</Label>
                    <Select
                      value={formData.payment_type}
                      onValueChange={(value) => setFormData({ ...formData, payment_type: value })}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTypes.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Timing */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Timing
                  </Label>
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
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-600" />
                      City *
                    </Label>
                    <Input
                      placeholder="e.g., Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Area / Locality *</Label>
                    <Input
                      placeholder="e.g., Andheri West"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" />
                    WhatsApp Number *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="10 digit number"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    required
                    className="h-12 rounded-xl"
                  />
                  <p className="text-xs text-gray-500">
                    Workers is number par contact karenge
                  </p>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Special Requirements (Optional)</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Koi special requirement ho toh likho..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="min-h-[80px] rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.category || !formData.description || !formData.payment || !formData.city || !formData.area || !formData.whatsapp}
                  className="w-full h-14 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-lg rounded-xl shadow-xl shadow-teal-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Job Post Karo'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}