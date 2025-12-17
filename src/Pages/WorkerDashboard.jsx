import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Bookmark, Send, User, MapPin, Briefcase, Loader2, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import JobCard from '@/components/ui/JobCard';
import { categoryLabels } from '@/components/ui/CategoryCard';

export default function WorkerDashboard() {
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

  const { data: savedJobs, isLoading: savedLoading } = useQuery({
    queryKey: ['savedJobs', profile?.saved_jobs],
    queryFn: async () => {
      if (!profile?.saved_jobs?.length) return [];
      const jobs = await base44.entities.Job.list('-created_date', 100);
      return jobs.filter(job => profile.saved_jobs.includes(job.id));
    },
    enabled: !!profile?.saved_jobs?.length
  });

  const { data: appliedJobs, isLoading: appliedLoading } = useQuery({
    queryKey: ['appliedJobs', profile?.applied_jobs],
    queryFn: async () => {
      if (!profile?.applied_jobs?.length) return [];
      const jobs = await base44.entities.Job.list('-created_date', 100);
      return jobs.filter(job => profile.applied_jobs.includes(job.id));
    },
    enabled: !!profile?.applied_jobs?.length
  });

  const { data: recommendedJobs, isLoading: recommendedLoading } = useQuery({
    queryKey: ['recommendedJobs', profile?.city, profile?.skills],
    queryFn: async () => {
      if (!profile?.city) return [];
      const jobs = await base44.entities.Job.filter({
        status: 'active',
        city: profile.city
      }, '-created_date', 20);
      // Filter by skills if available
      if (profile?.skills?.length) {
        return jobs.filter(job => profile.skills.includes(job.category)).slice(0, 10);
      }
      return jobs.slice(0, 10);
    },
    enabled: !!profile
  });

  /* New Query for Posted Jobs */
  const { data: postedJobs, isLoading: postedLoading } = useQuery({
    queryKey: ['workerPostedJobs', user?.id],
    queryFn: async () => {
      // Assuming workers can also post jobs, filter by employer_id = user.id
      return base44.entities.Job.filter({ employer_id: user.id }, '-created_date', 50);
    },
    enabled: !!user
  });

  const queryClient = useQueryClient();
  const [deleteJobId, setDeleteJobId] = useState(null);

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId) => {
      await base44.entities.Job.delete(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workerPostedJobs']);
      setDeleteJobId(null);
    }
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
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold mb-2">Profile Nahi Mila</h2>
            <p className="text-gray-600 mb-4">Pehle apna profile banao</p>
            <Link to={createPageUrl('WorkerRegistration')}>
              <Button className="bg-teal-600 hover:bg-teal-700">Profile Banao</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Namaste, {profile.full_name?.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center gap-2 text-blue-100">
                <MapPin className="w-4 h-4" />
                <span>{profile.area}, {profile.city}</span>
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

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.skills?.map(skill => (
              <Badge key={skill} className="bg-white/20 text-white border-0">
                {categoryLabels[skill] || skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-3 gap-3">
          <Link to={createPageUrl('FindWork')}>
            <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-teal-100 flex items-center justify-center">
                <Search className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Kaam Dhundo</span>
            </motion.div>
          </Link>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-100 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Saved</span>
            <Badge className="ml-1 bg-amber-500 text-white">{profile.saved_jobs?.length || 0}</Badge>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Applied</span>
            <Badge className="ml-1 bg-green-500 text-white">{profile.applied_jobs?.length || 0}</Badge>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="recommended" className="space-y-6">
          <TabsList className="bg-white shadow-sm rounded-xl p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="recommended" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Bookmark className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="applied" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Send className="w-4 h-4 mr-2" />
              Applied
            </TabsTrigger>
            <TabsTrigger value="posted" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Briefcase className="w-4 h-4 mr-2" />
              My Posts ({postedJobs?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended">
            {recommendedLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
            ) : recommendedJobs?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {recommendedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={handleSaveJob}
                    onApply={handleApply}
                    isSaved={profile.saved_jobs?.includes(job.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Abhi Jobs Nahi Hain</h3>
                <p className="text-gray-500 mb-4">Aapke area mein jaldi jobs aayengi</p>
                <Link to={createPageUrl('FindWork')}>
                  <Button className="bg-teal-600 hover:bg-teal-700">Sabhi Jobs Dekho</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {savedLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
            ) : savedJobs?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {savedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={handleSaveJob}
                    onApply={handleApply}
                    isSaved={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Koi Saved Jobs Nahi</h3>
                <p className="text-gray-500">Jobs save karo baad mein dekhne ke liye</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="applied">
            {appliedLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
            ) : appliedJobs?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {appliedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={handleSaveJob}
                    isSaved={profile.saved_jobs?.includes(job.id)}
                    showApply={false}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Abhi Tak Apply Nahi Kiya</h3>
                <p className="text-gray-500">Jobs dhundho aur WhatsApp par apply karo</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="posted">
            {postedLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
            ) : postedJobs?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {postedJobs.map(job => (
                  <div key={job.id} className="relative">
                    <JobCard
                      job={job}
                      onSave={handleSaveJob}
                      onApply={handleApply}
                      isSaved={profile.saved_jobs?.includes(job.id)}
                      showApply={false} // Don't allow applying to own job (UI logic)
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteJobId(job.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Koi Job Post Nahi Ki</h3>
                <p className="text-gray-500 mb-4">Agar aap kisi ko kaam dena chahte hain, to yahan post karein.</p>
                <Link to={createPageUrl('PostWork')}>
                  <Button className="bg-teal-600 hover:bg-teal-700">Job Post Karo</Button>
                </Link>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteJobId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Job?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this job post? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteJobId(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteJobMutation.mutate(deleteJobId)}
                  disabled={deleteJobMutation.isPending}
                >
                  {deleteJobMutation.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}