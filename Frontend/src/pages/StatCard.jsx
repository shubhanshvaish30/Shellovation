import React from 'react';
import { motion } from 'framer-motion';

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gradient-to-br ${color} rounded-2xl shadow-lg p-6 text-white`}
    >
      <div className="flex items-center space-x-4">
        <span className="text-3xl animate-float">{icon}</span>
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-white/80">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;