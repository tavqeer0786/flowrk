import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Filter, X, Briefcase, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from '@/components/ui/JobCard';
import { categoryLabels } from '@/components/ui/categoryConstants';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

export default function FindWork() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || '';

  const [filters, setFilters] = useState({
    category: initialCategory,
    city: '',
    area: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

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

      return base44.entities.Job.filter(query, '-created_date', 100);
    }
  });

  // Extract unique keywords from existing jobs for suggestions
  const allKeywords = React.useMemo(() => {
    if (!jobs) return [];
    const keywords = new Set();
    jobs.forEach(job => {
      // Add category
      if (job.category) keywords.add(categoryLabels[job.category] || job.category);
      // Add words from title
      if (job.title) {
        job.title.split(/\s+/).forEach(word => {
          if (word.length > 2) keywords.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        });
      }
      // Add words from description (limited)
      if (job.description) {
        job.description.split(/\s+/).slice(0, 10).forEach(word => {
          if (word.length > 3) keywords.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        });
      }
    });
    return Array.from(keywords);
  }, [jobs]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filteredSuggestions = allKeywords.filter(kw =>
        kw.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allKeywords]);

  const filteredJobs = jobs?.filter(job => {
    const searchMatch = !filters.search ||
      job.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      categoryLabels[job.category]?.toLowerCase().includes(filters.search.toLowerCase());

    const areaMatch = !filters.area || job.area.toLowerCase().includes(filters.area.toLowerCase());

    return searchMatch && areaMatch;
  }) || [];

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setFilters(prev => ({ ...prev, search: suggestion }));
    setSuggestions([]);
  };

  const handleSaveJob = async (job) => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth || !user) {
      alert("Login first");
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
    setFilters({ category: '', city: '', area: '', search: '' });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.category || filters.city || filters.area || filters.search;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Find Local Work & Nearby Jobs"
        description="Browse hundreds of local job openings in your city. From painting and cleaning to shop help and delivery — find daily work and get paid directly by employers."
        keywords={`find local jobs, work near me, ${filters.city || 'India'}, hiring ${filters.area || 'nearby'}, daily wage work`}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 py-12 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Find Your Next Work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-teal-100 text-lg mb-8"
          >
            Search through thousands of local opportunities
          </motion.p>

          {/* Main Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <div className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-2xl shadow-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Job title, category or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-14 border-0 focus-visible:ring-0 text-lg rounded-xl"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-14 px-8 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg hover:shadow-teal-100 transition-all duration-300"
              >
                Search Work
              </Button>
            </div>

            {/* Suggestions Overlay */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden"
                >
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase tracking-wider">Suggested Keywords</p>
                    <div className="flex flex-wrap gap-2 p-2">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full text-sm font-medium transition-colors border border-teal-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-3 md:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 justify-center rounded-xl h-11"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-teal-500">Active</Badge>
              )}
            </Button>
          </div>

          {/* Filter Controls */}
          <div className={`${showFilters || 'hidden md:flex'} items-center flex-wrap gap-4`}>
            {/* Category */}
            <div className="flex-1 md:flex-none">
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger className="md:w-56 h-11 rounded-xl bg-gray-50 border-gray-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="relative flex-1 md:max-w-[240px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="City (e.g., Mumbai)"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-200"
              />
            </div>

            {/* Area */}
            <div className="relative flex-1 md:max-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Area (e.g., Andheri)"
                value={filters.area}
                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-200"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            {hasActiveFilters && <span className="text-xs font-semibold text-gray-400 uppercase mr-2 text-nowrap">Filter:</span>}
            {filters.search && (
              <Badge variant="secondary" className="bg-teal-600 text-white hover:bg-teal-700 px-3 py-1.5 rounded-lg border-0">
                Search: {filters.search}
                <button onClick={() => { setFilters({ ...filters, search: '' }); setSearchQuery(''); }} className="ml-2 hover:text-gray-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            )}
            {filters.category && (
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg border-0">
                {categoryLabels[filters.category]}
                <button onClick={() => setFilters({ ...filters, category: '' })} className="ml-2">
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            )}
            {filters.city && (
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg border-0">
                City: {filters.city}
                <button onClick={() => setFilters({ ...filters, city: '' })} className="ml-2">
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            )}
            {filters.area && (
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg border-0">
                Area: {filters.area}
                <button onClick={() => setFilters({ ...filters, area: '' })} className="ml-2">
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            )}
          </div>
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
              No Jobs Found
            </h3>
            <p className="text-gray-500 mb-6">
              Try changing your filters or search area
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