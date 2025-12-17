import React from 'react';
import { Shield, Wallet, Phone, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const trustPoints = [
  {
    icon: Wallet,
    title: 'Zero Registration Fee',
    description: 'Completely free platform — no hidden charges'
  },
  {
    icon: Shield,
    title: 'No Advance Payment',
    description: 'Do not give advance to anyone — go directly to work'
  },
  {
    icon: Phone,
    title: 'Direct Employer Contact',
    description: 'No agent in between — talk directly'
  },
  {
    icon: BadgeCheck,
    title: 'Verified Listings',
    description: 'Report fake jobs — we will take action'
  }
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-teal-500/20 text-teal-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Safety & Trust
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Safety is Our Priority
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            You are safe on Flowrk.in — our promise
          </p>
        </motion.div>

        {/* Trust Points Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mb-4">
                <point.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">Safety Tip</h4>
            <p className="text-gray-300 text-sm">
              Never give advance payment. Report any suspicious job immediately. We will take action within 24 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}