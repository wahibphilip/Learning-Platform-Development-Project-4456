import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUsers, FiBook, FiFileText } = FiIcons;

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add Course',
      icon: FiBook,
      color: 'bg-blue-500',
      action: () => navigate('/courses')
    },
    {
      title: 'Add Student',
      icon: FiUsers,
      color: 'bg-green-500',
      action: () => navigate('/students')
    },
    {
      title: 'Create Exam',
      icon: FiFileText,
      color: 'bg-purple-500',
      action: () => navigate('/exams')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              variant="outline"
              className="w-full justify-start"
              onClick={action.action}
            >
              <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                <SafeIcon icon={action.icon} className="w-4 h-4 text-white" />
              </div>
              {action.title}
            </Button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default QuickActions;