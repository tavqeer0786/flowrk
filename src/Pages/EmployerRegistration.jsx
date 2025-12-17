import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import EmployerRegistrationForm from '@/components/forms/EmployerRegistrationForm';

export default function EmployerRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (!isAuthenticated) {
        base44.auth.redirectToLogin(createPageUrl('RoleSelection'));
        return;
      }
      
      const userData = await base44.auth.me();
      setUser(userData);
      
      // Check if already has employer profile
      const profiles = await base44.entities.EmployerProfile.filter({ user_id: userData.id });
      if (profiles && profiles.length > 0) {
        navigate(createPageUrl('EmployerDashboard'));
        return;
      }
      
      setCheckingAuth(false);
    } catch (error) {
      console.error('Auth error:', error);
      base44.auth.redirectToLogin(createPageUrl('RoleSelection'));
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await base44.entities.EmployerProfile.create({
        ...formData,
        user_id: user.id,
        total_jobs_posted: 0
      });
      
      navigate(createPageUrl('EmployerHome'));
    } catch (error) {
      console.error('Error creating profile:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-2xl shadow-gray-200/50 border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Employer Profile Banao
              </CardTitle>
              <p className="text-gray-500 mt-2">
                Apni details bharo aur workers dhundho
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <EmployerRegistrationForm 
                onSubmit={handleSubmit} 
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}