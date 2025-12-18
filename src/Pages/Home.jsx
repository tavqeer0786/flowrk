import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import HowItWorks from '@/components/home/HowItWorks';
import LatestJobs from '@/components/home/LatestJobs';
import TrustSection from '@/components/home/TrustSection';
import SEO from '@/components/SEO';

export default function Home() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['latestJobs'],
    queryFn: () => base44.entities.Job.filter({ status: 'active' }, '-created_date', 6),
  });

  return (
    <div className="min-h-screen">
      <SEO
        title="Find Local Jobs & Hire Workers Instantly"
        description="India's leading hyperlocal work platform. Find painters, cleaners, delivery boys, and shop helpers near you. No agents, no commission, direct contact."
        keywords="local jobs, find work near me, hire workers India, daily wage jobs, part time helper, Flowrk.in"
      />
      <HeroSection />
      <CategoriesSection />
      <HowItWorks />
      <LatestJobs jobs={jobs} isLoading={isLoading} />
      <TrustSection />
    </div>
  );
}