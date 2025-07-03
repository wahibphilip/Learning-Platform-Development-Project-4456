import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiBook, FiAward, FiClock } = FiIcons;

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'enrollment',
      message: 'Alice Johnson enrolled in React Fundamentals',
      time: '2 hours ago',
      icon: FiUser,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'completion',
      message: 'Bob Wilson completed JavaScript Basics',
      time: '4 hours ago',
      icon: FiBook,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'certificate',
      message: 'Certificate issued to Sarah Davis',
      time: '1 day ago',
      icon: FiAward,
      color: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'enrollment',
      message: 'Mike Brown enrolled in Advanced CSS',
      time: '2 days ago',
      icon: FiUser,
      color: 'text-blue-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <SafeIcon icon={activity.icon} className={`w-5 h-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default RecentActivity;