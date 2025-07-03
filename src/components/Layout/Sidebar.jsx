import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBook, FiUsers, FiUserCheck, FiTarget, FiMap, FiFileText, FiAward, FiGraduationCap } = FiIcons;

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/courses', icon: FiBook, label: 'Courses' },
    { path: '/students', icon: FiUsers, label: 'Students' },
    { path: '/tutors', icon: FiUserCheck, label: 'Tutors' },
    { path: '/campaigns', icon: FiTarget, label: 'Campaigns' },
    { path: '/paths', icon: FiMap, label: 'Learning Paths' },
    { path: '/exams', icon: FiFileText, label: 'Exams' },
    { path: '/certificates', icon: FiAward, label: 'Certificates' }
  ];

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
            <li key={item.path}>
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
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;