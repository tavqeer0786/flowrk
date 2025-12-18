import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import JobCard from '@/components/ui/JobCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function LatestJobs({ jobs, isLoading }) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Latest Opportunities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              View New Jobs
            </h2>
          </div>
          <Link to={createPageUrl('FindWork')}>
            <Button
              className="bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white border border-teal-200 rounded-xl group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-bold"
            >
              All Jobs
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 6).map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard job={job} showApply={true} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Available Right Now</h3>
            <p className="text-gray-500 mb-6">New jobs will be posted soon</p>
            <Link to={createPageUrl('PostWork')}>
              <Button className="bg-teal-600 hover:bg-teal-700 rounded-xl">
                Post First Job
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}