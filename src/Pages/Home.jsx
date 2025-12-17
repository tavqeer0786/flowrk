import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import HowItWorks from '@/components/home/HowItWorks';
import LatestJobs from '@/components/home/LatestJobs';
import TrustSection from '@/components/home/TrustSection';

export default function Home() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['latestJobs'],
    queryFn: () => base44.entities.Job.filter({ status: 'active' }, '-created_date', 6),
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <HowItWorks />
      <LatestJobs jobs={jobs} isLoading={isLoading} />
      <TrustSection />
    </div>
  );
}