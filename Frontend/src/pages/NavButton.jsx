import React from 'react';
import { motion } from 'framer-motion';

function NavButton({ title, icon, color, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full bg-gradient-to-br ${color} rounded-2xl shadow-lg p-6 text-white
        transition-all duration-300 hover:shadow-xl
        flex flex-col items-center justify-center space-y-2`}
      onClick={onClick} // Attach the onClick handler here
    >
      <span className="text-3xl animate-float">{icon}</span>
      <span className="font-medium">{title}</span>
    </motion.button>
  );
}

export default NavButton;
