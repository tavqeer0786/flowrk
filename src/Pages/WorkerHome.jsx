import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User, MapPin, Settings, LogOut, Loader2, Search,
  UserPlus, MessageCircle, ArrowRight, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/ui/CategoryCard';
import JobCard from '@/components/ui/JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { categoryLabels } from '@/components/ui/CategoryCard';

const categories = ['painting', 'cleaning', 'delivery', 'shop_helper', 'event_work'];

const howItWorksSteps = [
  {
    icon: UserPlus,
    title: 'Create Profile',
    description: 'Fill a simple form — enter name, city, area and select skills',
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: Search,
    title: 'Find Work',
    description: 'View latest jobs in your area and choose work you like',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    icon: MessageCircle,
    title: 'Direct Contact',
    description: 'Chat directly with the employer on WhatsApp — no agents',
    color: 'from-amber-500 to-orange-600'
  }
];

export default function WorkerHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

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

      // Check if employer trying to access worker page
      if (userData.user_role === 'employer') {
        navigate(createPageUrl('EmployerHome'));
        return;
      }

      setUser(userData);
      setCheckingAuth(false);
    } catch (error) {
      base44.auth.redirectToLogin(createPageUrl('RoleSelection'));
    }
  };

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['workerProfile', user?.id],
    queryFn: async () => {
      const profiles = await base44.entities.WorkerProfile.filter({ user_id: user.id });
      return profiles?.[0] || null;
    },
    enabled: !!user
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', selectedCategory, profile?.city],
    queryFn: async () => {
      let query = { status: 'active' };
      if (selectedCategory) query.category = selectedCategory;
      if (profile?.city) query.city = profile.city;

      return base44.entities.Job.filter(query, '-created_date', 20);
    },
    enabled: !!profile
  });

  const handleSaveJob = async (job) => {
    if (!profile) return;

    const currentSaved = profile.saved_jobs || [];
    const newSavedJobs = currentSaved.includes(job.id)
      ? currentSaved.filter(id => id !== job.id)
      : [...currentSaved, job.id];

    await base44.entities.WorkerProfile.update(profile.id, {
      saved_jobs: newSavedJobs
    });
    refetchProfile();
  };

  const handleApply = async (job) => {
    if (!profile) return;

    const currentApplied = profile.applied_jobs || [];
    if (!currentApplied.includes(job.id)) {
      await base44.entities.WorkerProfile.update(profile.id, {
        applied_jobs: [...currentApplied, job.id]
      });
      refetchProfile();
    }
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

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
          <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Profile Nahi Mila</h2>
          <p className="text-gray-600 mb-4">Pehle apna profile banao</p>
          <Link to={createPageUrl('WorkerRegistration')}>
            <Button className="bg-teal-600 hover:bg-teal-700">Profile Banao</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* User Info & Actions */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Hello, {profile.full_name?.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center gap-2 text-blue-100">
                <MapPin className="w-4 h-4" />
                <span>{profile.area}, {profile.city}</span>
              </div>
              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.skills?.map(skill => (
                  <Badge key={skill} className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {categoryLabels[skill] || skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={createPageUrl('EditWorkerProfile')}>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Choose Your Skill
            </h2>
            <p className="text-blue-100 text-lg">
              Select a category below and see latest jobs in your area
            </p>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CategoryCard
                category={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                selected={selectedCategory === category}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Jobs Link */}
        <div className="text-center mt-6">
          <Link to={createPageUrl('FindWork')}>
            <Button variant="outline" className="rounded-xl">
              <Search className="w-4 h-4 mr-2" />
              View All Jobs (Advanced Filters)
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
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
              Finding work on Flowrk.in is very easy
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

      {/* Latest Opportunities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="inline-block bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                  Latest Opportunities
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {selectedCategory
                    ? `${categoryLabels[selectedCategory]} Jobs`
                    : profile?.city ? `New Jobs in ${profile.city}` : 'New Jobs For You'}
                </h2>
              </div>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                Clear Filter
              </button>
            )}
          </motion.div>

          {jobsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : jobs && jobs.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.slice(0, 9).map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <JobCard
                      job={job}
                      onSave={handleSaveJob}
                      onApply={handleApply}
                      isSaved={profile.saved_jobs?.includes(job.id)}
                    />
                  </motion.div>
                ))}
              </div>

              {jobs.length > 9 && (
                <div className="text-center mt-8">
                  <Link to={createPageUrl('FindWork')}>
                    <Button className="bg-teal-600 hover:bg-teal-700 rounded-xl">
                      View More Jobs
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedCategory
                  ? `No ${categoryLabels[selectedCategory]} jobs available right now`
                  : 'No Jobs Available Right Now'}
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory
                  ? 'Try another category or view all jobs'
                  : 'Jobs will be posted soon'}
              </p>
              {selectedCategory ? (
                <Button onClick={() => setSelectedCategory('')} variant="outline" className="rounded-xl">
                  View All Jobs
                </Button>
              ) : (
                <Link to={createPageUrl('FindWork')}>
                  <Button className="bg-teal-600 hover:bg-teal-700 rounded-xl">
                    <Search className="w-4 h-4 mr-2" />
                    Browse All Jobs
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick Access to Dashboard */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link to={createPageUrl('WorkerDashboard')}>
          <Button className="h-14 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-2xl">
            <User className="w-5 h-5 mr-2" />
            My Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}