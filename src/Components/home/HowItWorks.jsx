import React from 'react';
import { UserPlus, Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
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

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative text-center"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
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
  );
}