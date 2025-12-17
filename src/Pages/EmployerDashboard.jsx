import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Briefcase, CheckCircle, XCircle, MapPin, Settings, LogOut, 
  Loader2, IndianRupee, Clock, MessageCircle, Edit, Trash2, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { categoryLabels, categoryColors } from '@/components/ui/CategoryCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [deleteJobId, setDeleteJobId] = useState(null);

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

  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['employerJobs', user?.id],
    queryFn: async () => {
      return base44.entities.Job.filter({ employer_id: user.id }, '-created_date', 50);
    },
    enabled: !!user
  });

  const closeJobMutation = useMutation({
    mutationFn: async (jobId) => {
      await base44.entities.Job.update(jobId, { status: 'closed' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employerJobs']);
    }
  });

  const reopenJobMutation = useMutation({
    mutationFn: async (jobId) => {
      await base44.entities.Job.update(jobId, { status: 'active' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employerJobs']);
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId) => {
      await base44.entities.Job.delete(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employerJobs']);
      setDeleteJobId(null);
    }
  });

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const activeJobs = jobs?.filter(j => j.status === 'active') || [];
  const closedJobs = jobs?.filter(j => j.status === 'closed') || [];

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
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold mb-2">Profile Nahi Mila</h2>
            <p className="text-gray-600 mb-4">Pehle apna employer profile banao</p>
            <Link to={createPageUrl('EmployerRegistration')}>
              <Button className="bg-teal-600 hover:bg-teal-700">Profile Banao</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const JobListItem = ({ job }) => {
    const gradient = categoryColors[job.category] || 'from-gray-400 to-gray-500';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className={`h-1 bg-gradient-to-r ${gradient}`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="bg-gray-100">
                  {categoryLabels[job.category]}
                </Badge>
                <Badge className={job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                  {job.status === 'active' ? 'Active' : 'Closed'}
                </Badge>
              </div>
              <h3 className="font-bold text-gray-900">
                {job.title || job.description?.slice(0, 50) + '...'}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-teal-600" />
              {job.area}, {job.city}
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-amber-500" />
              {job.payment}
            </div>
            {job.timing && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-violet-500" />
                {job.timing}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {job.status === 'active' ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => closeJobMutation.mutate(job.id)}
                disabled={closeJobMutation.isPending}
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Close Job
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => reopenJobMutation.mutate(job.id)}
                disabled={reopenJobMutation.isPending}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Reopen
              </Button>
            )}
            <Link to={`${createPageUrl('EditJob')}?id=${job.id}`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteJobId(job.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Namaste, {profile.name?.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center gap-2 text-amber-100">
                <MapPin className="w-4 h-4" />
                <span>{profile.area}, {profile.city}</span>
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
        </div>
      </div>

      {/* Stats & Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to={createPageUrl('PostWork')}>
            <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-4 text-center text-white">
              <Plus className="w-8 h-8 mx-auto mb-2" />
              <span className="font-semibold">Naya Job Post</span>
            </motion.div>
          </Link>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-teal-600">{activeJobs.length}</div>
            <span className="text-sm text-gray-600">Active Jobs</span>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{closedJobs.length}</div>
            <span className="text-sm text-gray-600">Closed Jobs</span>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{profile.total_jobs_posted || 0}</div>
            <span className="text-sm text-gray-600">Total Posted</span>
          </motion.div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-white shadow-sm rounded-xl p-1">
            <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="closed" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <XCircle className="w-4 h-4 mr-2" />
              Closed ({closedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {jobsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
            ) : activeJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {activeJobs.map(job => (
                  <JobListItem key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Koi Active Jobs Nahi</h3>
                <p className="text-gray-500 mb-4">Naya job post karo workers dhundne ke liye</p>
                <Link to={createPageUrl('PostWork')}>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Job Post Karo
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="closed">
            {closedJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {closedJobs.map(job => (
                  <JobListItem key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Koi Closed Jobs Nahi</h3>
                <p className="text-gray-500">Jab job complete ho jayegi, use close kar dena</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteJobId} onOpenChange={() => setDeleteJobId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Job Delete Karna Hai?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Yeh action undo nahi hoga. Job permanently delete ho jayega.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteJobMutation.mutate(deleteJobId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteJobMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}