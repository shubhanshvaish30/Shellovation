import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import StatCard from './StatCard';
import NavButton from './NavButton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function AdminHome() {
  const { orders, users, products, coupons } = useSelector(
    (state) => state.admin
  );

  const navigate = useNavigate();  // Initialize the navigate function

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: '📦', color: 'from-blue-400 to-blue-600' },
    { label: 'Active Users', value: users.length, icon: '👥', color: 'from-green-400 to-green-600' },
    { label: 'Total Products', value: products.length, icon: '🛍️', color: 'from-purple-400 to-purple-600' },
    { label: 'Total Coupons', value: coupons.length, icon: '🏷️', color: 'from-yellow-400 to-yellow-600' },
  ];

  const navigationButtons = [
    { title: 'Orders', icon: '📦', color: 'from-blue-500 to-blue-700', route: '/adminOrders' },
    { title: 'Users', icon: '👥', color: 'from-green-500 to-green-700', route: '/adminUsers' },
    { title: 'Add Products', icon: '➕', color: 'from-purple-500 to-purple-700', route: '/addProduct' },
    { title: 'Coupons', icon: '🏷️', color: 'from-orange-500 to-orange-700', route: '/coupons' },
    { title: 'Complaints', icon: '⚠️', color: 'from-red-500 to-red-700', route: '/adminComplaint' },  // Added Complaints route
  ];

  const handleNavigation = (route) => {
    navigate(route);  // Navigate to the given route
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="bg-gradient-to-r from-gray-600 to-gray-100 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-3xl font-bold text-white mb-4 md:mb-0"
            >
              Admin Dashboard
            </motion.h1>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-4 bg-white/50 rounded-full px-4 py-2"
            >
              <span className="text-2xl">👤</span>
              <span className="text-black font-medium">Admin</span>
            </motion.div>
          </div>
        </header>

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Admin!</h2>
          <p className="text-gray-600">Here's what's happening with your store today.</p>
        </motion.section>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {navigationButtons.map((button, index) => (
      <NavButton 
        key={index} 
        {...button} 
        onClick={() => handleNavigation(button.route)}  // Add onClick handler for navigation
      />
    ))}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminHome;
