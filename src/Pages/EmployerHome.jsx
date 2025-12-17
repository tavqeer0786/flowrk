import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase, MapPin, Settings, LogOut, Loader2, Plus,
  CheckCircle, XCircle, Edit, Trash2, ArrowRight,
  FileText, MessageCircle, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { categoryLabels, categoryColors } from '@/components/ui/CategoryCard';

const howItWorksSteps = [
  {
    icon: FileText,
    title: 'Fill Job Details',
    description: 'Enter category, payment, location and job description in a simple form',
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: Users,
    title: 'Workers Will Apply',
    description: 'Your job listing will be visible to interested local workers',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    icon: MessageCircle,
    title: 'Direct Contact',
    description: 'Interested workers will contact you on WhatsApp — chat directly',
    color: 'from-amber-500 to-orange-600'
  }
];

export default function EmployerHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

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

      // Check if worker trying to access employer page
      if (userData.user_role === 'worker') {
        navigate(createPageUrl('WorkerHome'));
        return;
      }

      setUser(userData);
      setCheckingAuth(false);
    } catch (error) {
      base44.auth.redirectToLogin(createPageUrl('RoleSelection'));
    }
  };

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['employerProfile', user?.id],
    queryFn: async () => {
      const profiles = await base44.entities.EmployerProfile.filter({ user_id: user.id });
      return profiles?.[0] || null;
    },
    enabled: !!user
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['employerJobs', user?.id],
    queryFn: async () => {
      return base44.entities.Job.filter({ employer_id: user.id }, '-created_date', 10);
    },
    enabled: !!user
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const activeJobs = jobs?.filter(j => j.status === 'active') || [];
  const totalJobsPosted = profile?.total_jobs_posted || 0;

  if (checkingAuth || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Please create your employer profile first</p>
          <Link to={createPageUrl('EmployerRegistration')}>
            <Button className="bg-teal-600 hover:bg-teal-700">Create Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* User Info & Actions */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Hello, {profile.name?.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center gap-2 text-amber-100">
                <MapPin className="w-4 h-4" />
                <span>{profile.area}, {profile.city}</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  {profile.employer_type?.replace(/_/g, ' ')}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  {totalJobsPosted} Jobs Posted
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={createPageUrl('EditEmployerProfile')}>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Post a Job to Find Workers
            </h2>
            <p className="text-amber-100 text-lg mb-6">
              Fill a simple form and show your job to workers in your area
            </p>
            <Link to={createPageUrl('PostWork')}>
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl group"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post New Job
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{activeJobs.length}</div>
            </div>
            <p className="text-sm text-gray-600">Active Jobs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalJobsPosted}</div>
            </div>
            <p className="text-sm text-gray-600">Total Posted</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 col-span-2 md:col-span-1"
          >
            <Link to={createPageUrl('EmployerDashboard')}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-lg font-bold text-teal-600">Manage Jobs</div>
              </div>
              <p className="text-sm text-gray-600">View & edit all jobs</p>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Just 3 Simple Steps
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Finding workers on Flowrk.in is very easy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Connector Line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 to-transparent" />
                )}

                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border-2 border-gray-100 text-sm font-bold text-gray-400">
                  0{index + 1}
                </div>

                {/* Icon */}
                <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl mb-6`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      {jobs && jobs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Your Recent Jobs
                </h2>
                <p className="text-gray-600">Overview of your latest posted jobs</p>
              </div>
              <Link to={createPageUrl('EmployerDashboard')}>
                <Button variant="outline" className="rounded-xl">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.slice(0, 6).map((job, index) => {
                const gradient = categoryColors[job.category] || 'from-gray-400 to-gray-500';
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-gray-100">
                            {categoryLabels[job.category]}
                          </Badge>
                          <Badge className={job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                            {job.status === 'active' ? 'Active' : 'Closed'}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                          {job.title || job.description?.slice(0, 40) + '...'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          {job.area}
                        </div>
                        <Link to={`${createPageUrl('EditJob')}?id=${job.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Job
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <Link to={createPageUrl('PostWork')}>
          <Button className="h-14 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-full shadow-2xl">
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>
    </div>
  );
}