import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBook, FiUsers, FiUserCheck, FiTarget, FiMap, FiFileText, FiAward, FiGraduationCap, FiSettings, FiShield, FiDollarSign, FiPercent, FiTrendingUp, FiCreditCard } = FiIcons;

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/dashboard/courses', icon: FiBook, label: 'Courses' },
    { path: '/dashboard/students', icon: FiUsers, label: 'Students' },
    { path: '/dashboard/tutors', icon: FiUserCheck, label: 'Tutors' },
    { path: '/dashboard/campaigns', icon: FiTarget, label: 'Campaigns' },
    { path: '/dashboard/paths', icon: FiMap, label: 'Learning Paths' },
    { path: '/dashboard/exams', icon: FiFileText, label: 'Exams' },
    { path: '/dashboard/certificates', icon: FiAward, label: 'Certificates' },
    { 
      label: 'Payments', 
      icon: FiDollarSign, 
      subItems: [
        { path: '/dashboard/subscription-plans', icon: FiCreditCard, label: 'Subscription Plans' },
        { path: '/dashboard/coupons', icon: FiPercent, label: 'Coupons' },
        { path: '/dashboard/commission-settings', icon: FiDollarSign, label: 'Commissions' },
        { path: '/dashboard/payment-analytics', icon: FiTrendingUp, label: 'Analytics' }
      ]
    },
    { path: '/dashboard/roles', icon: FiShield, label: 'Role Management' },
    { path: '/dashboard/settings', icon: FiSettings, label: 'Settings' }
  ];

  const [expandedSections, setExpandedSections] = React.useState({ 'Payments': true });

  const toggleSection = (label) => {
    setExpandedSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white shadow-lg"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <SafeIcon icon={FiGraduationCap} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduPlatform</h1>
            <p className="text-sm text-gray-500">Learning Management</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path || item.label}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={item.icon} className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <SafeIcon 
                      icon={expandedSections[item.label] ? FiUsers : FiUsers} 
                      className={`w-4 h-4 transform transition-transform ${expandedSections[item.label] ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {expandedSections[item.label] && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-primary-50 text-primary-600'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`
                            }
                          >
                            <SafeIcon icon={subItem.icon} className="w-4 h-4" />
                            <span className="text-sm font-medium">{subItem.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;