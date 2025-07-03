import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiGraduationCap, FiUsers, FiBook, FiAward, FiArrowRight, FiPlay, FiStar, FiCheck, FiShield, FiUserCheck, FiSettings } = FiIcons;

const Landing = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const demoUsers = [
    {
      role: 'Super Admin',
      email: 'superadmin@eduplatform.com',
      password: 'admin123',
      name: 'Sarah Johnson',
      description: 'Full platform access with all permissions',
      permissions: ['All System Permissions', 'User Management', 'Financial Controls'],
      icon: FiShield,
      color: 'bg-red-500'
    },
    {
      role: 'Administrator',
      email: 'admin@eduplatform.com',
      password: 'admin123',
      name: 'Michael Chen',
      description: 'Administrative access to most features',
      permissions: ['Course Management', 'Student Management', 'Analytics'],
      icon: FiSettings,
      color: 'bg-blue-500'
    },
    {
      role: 'Instructor',
      email: 'instructor@eduplatform.com',
      password: 'instructor123',
      name: 'Dr. Emily Rodriguez',
      description: 'Teaching and course management access',
      permissions: ['Create Courses', 'Grade Students', 'Issue Certificates'],
      icon: FiUserCheck,
      color: 'bg-green-500'
    },
    {
      role: 'Content Creator',
      email: 'creator@eduplatform.com',
      password: 'creator123',
      name: 'Alex Thompson',
      description: 'Content creation and management',
      permissions: ['Create Content', 'Manage Courses', 'View Analytics'],
      icon: FiBook,
      color: 'bg-purple-500'
    },
    {
      role: 'Support Staff',
      email: 'support@eduplatform.com',
      password: 'support123',
      name: 'Lisa Wang',
      description: 'Customer support and assistance',
      permissions: ['View Students', 'Basic Management', 'Help Users'],
      icon: FiUsers,
      color: 'bg-yellow-500'
    }
  ];

  const features = [
    {
      icon: FiBook,
      title: 'Course Management',
      description: 'Create, organize, and manage comprehensive courses with multimedia content'
    },
    {
      icon: FiUsers,
      title: 'Student & Tutor Management',
      description: 'Efficiently manage learners and instructors with detailed profiles and progress tracking'
    },
    {
      icon: FiAward,
      title: 'Certificates & Assessments',
      description: 'Issue verified certificates and create comprehensive exams with auto-grading'
    },
    {
      icon: FiGraduationCap,
      title: 'Learning Paths',
      description: 'Design structured learning journeys with prerequisite courses and milestones'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '500+', label: 'Expert Instructors' },
    { number: '1,200+', label: 'Courses Available' },
    { number: '50,000+', label: 'Certificates Issued' }
  ];

  const handleDemoLogin = async (user) => {
    setLoading(true);
    try {
      await login(user.email, user.password, user);
      toast.success(`Logged in as ${user.role}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiGraduationCap} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduPlatform</h1>
                <p className="text-xs text-gray-500">Learning Management System</p>
              </div>
            </div>
            <Button onClick={() => navigate('/login')} variant="outline">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Modern Learning
                <span className="text-primary-600"> Management</span>
                <br />
                Platform
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Empower education with our comprehensive platform featuring course management, 
                student tracking, certificates, payments, and advanced analytics.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Users Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Try Different Roles
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the platform from different perspectives. Click any demo user below to login instantly.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoUsers.map((user, index) => (
              <motion.div
                key={user.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => handleDemoLogin(user)}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${user.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <SafeIcon icon={user.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.role}</h3>
                      <p className="text-sm text-gray-500">{user.name}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{user.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {user.permissions.map((permission, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{permission}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <p>Email: {user.email}</p>
                        <p>Password: {user.password}</p>
                      </div>
                      <SafeIcon icon={FiArrowRight} className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Information</h3>
              <p className="text-blue-800 text-sm">
                All demo accounts come pre-loaded with sample data including courses, students, 
                certificates, and payment information. Click any card above for instant access.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage and deliver exceptional learning experiences
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={feature.icon} className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Education?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of educators and institutions already using EduPlatform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => handleDemoLogin(demoUsers[0])}>
                <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" />
                Try Demo Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiGraduationCap} className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">EduPlatform</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Modern learning management platform for the digital age.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Course Management</li>
                <li>Student Portal</li>
                <li>Analytics</li>
                <li>Certificates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Support</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-gray-700">Logging in...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;