import { Paintbrush, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { categoryIcons, categoryLabels, categoryColors } from './categoryConstants';


export default function CategoryCard({ category, onClick, selected = false }) {
  const Icon = categoryIcons[category] || Store;
  const label = categoryLabels[category] || category;
  const gradient = categoryColors[category] || 'from-gray-400 to-gray-500';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-2xl p-6 
        bg-white shadow-lg shadow-gray-100/50
        border-2 transition-all duration-300
        ${selected ? 'border-teal-500 ring-4 ring-teal-100' : 'border-transparent hover:border-teal-200'}
      `}
    >
      <div className={`
        w-14 h-14 rounded-xl bg-gradient-to-br ${gradient}
        flex items-center justify-center mb-4
        shadow-lg
      `}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-semibold text-gray-800 text-lg">{label}</h3>
      <p className="text-sm text-gray-500 mt-1">Local jobs available</p>
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

