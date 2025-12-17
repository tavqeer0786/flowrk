import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Filter, X, Briefcase, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from '@/components/ui/JobCard';
import { categoryLabels } from '@/components/ui/CategoryCard';
import { Badge } from '@/components/ui/badge';

export default function FindWork() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || '';
  
  const [filters, setFilters] = useState({
    category: initialCategory,
    city: '',
    area: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
        
        // Load worker profile for saved jobs
        const profiles = await base44.entities.WorkerProfile.filter({ user_id: userData.id });
        if (profiles && profiles.length > 0) {
          setWorkerProfile(profiles[0]);
          setSavedJobs(profiles[0].saved_jobs || []);
        }
      }
    } catch (e) {
      console.log('Not logged in');
    }
  };

  const { data: jobs, isLoading, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query = { status: 'active' };
      if (filters.category) query.category = filters.category;
      if (filters.city) query.city = filters.city;
      
      return base44.entities.Job.filter(query, '-created_date', 50);
    }
  });

  const filteredJobs = jobs?.filter(job => {
    if (filters.area && !job.area.toLowerCase().includes(filters.area.toLowerCase())) {
      return false;
    }
    return true;
  }) || [];

  const handleSaveJob = async (job) => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth || !user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    
    const newSavedJobs = savedJobs.includes(job.id)
      ? savedJobs.filter(id => id !== job.id)
      : [...savedJobs, job.id];
    
    setSavedJobs(newSavedJobs);
    
    if (workerProfile) {
      await base44.entities.WorkerProfile.update(workerProfile.id, {
        saved_jobs: newSavedJobs
      });
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', city: '', area: '' });
  };

  const hasActiveFilters = filters.category || filters.city || filters.area;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Kaam Dhundo
          </h1>
          <p className="text-teal-100">
            Apne area mein latest jobs dekho
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-3 md:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-teal-500">Active</Badge>
              )}
            </Button>
          </div>

          {/* Filter Controls */}
          <div className={`${showFilters || 'hidden md:flex'} flex flex-col md:flex-row gap-4`}>
            {/* Category */}
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger className="md:w-48 h-11 rounded-xl">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City */}
            <div className="relative flex-1 md:max-w-xs">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="City (e.g., Mumbai)"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="pl-10 h-11 rounded-xl"
              />
            </div>

            {/* Area */}
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Area (e.g., Andheri)"
                value={filters.area}
                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                className="pl-10 h-11 rounded-xl"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-500"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.category && (
                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                  {categoryLabels[filters.category]}
                  <button onClick={() => setFilters({ ...filters, category: '' })} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.city && (
                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                  {filters.city}
                  <button onClick={() => setFilters({ ...filters, city: '' })} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.area && (
                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                  {filters.area}
                  <button onClick={() => setFilters({ ...filters, area: '' })} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              {filteredJobs.length} job{filteredJobs.length !== 1 && 's'} found
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <JobCard
                      job={job}
                      onSave={handleSaveJob}
                      isSaved={savedJobs.includes(job.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Koi Jobs Nahi Mili
            </h3>
            <p className="text-gray-500 mb-6">
              Filters change karke dobara try karo
            </p>
            <Button onClick={clearFilters} variant="outline" className="rounded-xl">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}