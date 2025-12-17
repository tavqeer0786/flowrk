import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import CategoryCard from '@/components/ui/CategoryCard';
import { motion } from 'framer-motion';

const categories = ['painting', 'cleaning', 'delivery', 'shop_helper', 'event_work'];

export default function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Skill
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find local employers in every category offering work in your area
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`${createPageUrl('FindWork')}?category=${category}`}>
                <CategoryCard category={category} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}