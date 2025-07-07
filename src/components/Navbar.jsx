import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiPlus, FiList, FiBarChart3, FiBrain, FiTarget } = FiIcons;

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/trade-entry', icon: FiPlus, label: 'Add Trade' },
    { path: '/trade-history', icon: FiList, label: 'History' },
    { path: '/analytics', icon: FiBarChart3, label: 'Analytics' },
    { path: '/psychology', icon: FiBrain, label: 'Psychology' },
    { path: '/goals', icon: FiTarget, label: 'Goals' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiBarChart3} className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Forex Journal</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <div className={`flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}>
                  <SafeIcon icon={item.icon} className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
                
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;