import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Briefcase, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkUserAndRole();
  }, []);

  const checkUserAndRole = async () => {
    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (!isAuthenticated) {
        alert("login first");
        base44.auth.redirectToLogin(createPageUrl('RoleSelection'));
        return;
      }

      const user = await base44.auth.me();

      // Check if user already has a role set
      if (user.user_role) {
        // Redirect to appropriate dashboard
        if (user.user_role === 'worker') {
          navigate(createPageUrl('WorkerDashboard'));
        } else if (user.user_role === 'employer') {
          navigate(createPageUrl('EmployerDashboard'));
        }
        return;
      }

      setCheckingAuth(false);
    } catch (error) {
      console.error('Auth check error:', error);
      base44.auth.redirectToLogin(createPageUrl('RoleSelection'));
    }
  };

  const handleRoleSelect = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      await base44.auth.updateMe({ user_role: selectedRole });

      // Redirect to appropriate page
      // Redirect to appropriate page
      const user = await base44.auth.me();
      if (selectedRole === 'worker') {
        const profile = await base44.entities.WorkerProfile.get(user.id);
        if (profile) {
          navigate(createPageUrl('WorkerHome'));
        } else {
          navigate(createPageUrl('WorkerRegistration'));
        }
      } else {
        const profile = await base44.entities.EmployerProfile.get(user.id);
        if (profile) {
          navigate(createPageUrl('EmployerHome'));
        } else {
          navigate(createPageUrl('EmployerRegistration'));
        }
      }
    } catch (error) {
      console.error('Error setting role:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-gray-50 py-12 px-4">
      <SEO
        title="Get Started - Join as Worker or Employer"
        description="Choose your role on Flowrk.in. Whether you want to find local work or hire talented workers, get started in seconds."
        keywords="join Flowrk, register for jobs, hire labor, find worker registration, worker signup India"
      />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-xl shadow-teal-200">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to Flowrk.in!
          </h1>
          <p className="text-gray-600 text-lg">
            What would you like to do here?
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Worker Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              onClick={() => setSelectedRole('worker')}
              className={`
                cursor-pointer transition-all duration-300 border-2 overflow-hidden
                ${selectedRole === 'worker'
                  ? 'border-teal-500 shadow-xl shadow-teal-100 ring-4 ring-teal-100'
                  : 'border-transparent hover:border-teal-200 shadow-lg'}
              `}
            >
              <CardContent className="p-8">
                <div className="relative">
                  {selectedRole === 'worker' && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    I Want To Find Work
                  </h3>
                  <p className="text-gray-600">
                    I am a worker looking for work in my area
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Employer Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              onClick={() => setSelectedRole('employer')}
              className={`
                cursor-pointer transition-all duration-300 border-2 overflow-hidden
                ${selectedRole === 'employer'
                  ? 'border-teal-500 shadow-xl shadow-teal-100 ring-4 ring-teal-100'
                  : 'border-transparent hover:border-teal-200 shadow-lg'}
              `}
            >
              <CardContent className="p-8">
                <div className="relative">
                  {selectedRole === 'employer' && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    I Want To Hire
                  </h3>
                  <p className="text-gray-600">
                    I am an employer looking for workers
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleRoleSelect}
            disabled={!selectedRole || isLoading}
            className="w-full h-14 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-lg rounded-xl shadow-xl shadow-teal-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}