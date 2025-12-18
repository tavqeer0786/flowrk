import React from 'react';
import { MapPin, Clock, IndianRupee, Bookmark, BookmarkCheck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categoryLabels, categoryColors } from './categoryConstants';

import { base44 } from '@/api/base44Client';

export default function JobCard({
  job,
  onSave,
  onApply,
  isSaved = false,
  showApply = true,
  compact = false
}) {
  const gradient = categoryColors[job.category] || 'from-gray-400 to-gray-500';

  const handleWhatsAppApply = async () => {
    // Check if user is logged in
    const isAuth = await base44.auth.isAuthenticated();

    if (!isAuth) {
      alert("Login first");
      base44.auth.redirectToLogin(window.location.href);
      return;
    }

    const message = encodeURIComponent(
      `Hello! I saw your job on Flowrk.in - "${job.title || job.description?.slice(0, 50)}". Is this still available?`
    );
    const whatsappUrl = `https://wa.me/91${job.whatsapp?.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    if (onApply) onApply(job);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 overflow-hidden border border-gray-100 hover:border-teal-200 transition-all duration-300"
    >
      {/* Category Strip */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className={`p-5 ${compact ? 'p-4' : 'p-5 md:p-6'}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium">
                {categoryLabels[job.category] || job.category}
              </Badge>
              {job.status === 'active' ? (
                <Badge className="bg-green-100 text-green-700 border-0">
                  Active
                </Badge>
              ) : job.status === 'pending' ? (
                <Badge className="bg-amber-100 text-amber-700 border-0">
                  Pending Approval
                </Badge>
              ) : job.status === 'closed' ? (
                <Badge className="bg-gray-100 text-gray-600 border-0">
                  Closed
                </Badge>
              ) : null}
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {job.title || job.description?.slice(0, 60)}
            </h3>
          </div>
          {onSave && (
            <button
              onClick={() => onSave(job)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-teal-600" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Description */}
        {!compact && job.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>
        )}

        {/* Details */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>{job.area}, {job.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <IndianRupee className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-gray-900">{job.payment}</span>
          </div>
          {job.timing && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-violet-500" />
              <span>{job.timing}</span>
            </div>
          )}
        </div>

        {/* Employer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs border border-teal-100">
              {(job.employer_name || 'E').slice(0, 1).toUpperCase()}
            </div>
            <div className="text-sm">
              <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">Posted by</span>
              <span className="font-bold text-gray-900 leading-tight">{job.employer_name || 'Employer'}</span>
            </div>
          </div>

          {showApply && (
            <Button
              onClick={handleWhatsAppApply}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-100 hover:shadow-emerald-200 transition-all duration-300 hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Apply
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}