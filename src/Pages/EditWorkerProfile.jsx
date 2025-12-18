import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import WorkerRegistrationForm from '@/components/forms/WorkerRegistrationForm';

export default function EditWorkerProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (!isAuthenticated) {
        base44.auth.redirectToLogin(createPageUrl('WorkerDashboard'));
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
      setCheckingAuth(false);
    } catch (error) {
      base44.auth.redirectToLogin(createPageUrl('WorkerDashboard'));
    }
  };

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['workerProfile', user?.id],
    queryFn: async () => {
      const profiles = await base44.entities.WorkerProfile.filter({ user_id: user.id });
      return profiles?.[0] || null;
    },
    enabled: !!user
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await base44.entities.WorkerProfile.update(profile.id, formData);
      setIsSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl('WorkerDashboard'));
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setIsLoading(false);
  };

  if (checkingAuth || profileLoading) {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Updated!</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Link to={createPageUrl('WorkerDashboard')} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-2xl shadow-gray-200/50 border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {profile && (
                <WorkerRegistrationForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  initialData={profile}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}