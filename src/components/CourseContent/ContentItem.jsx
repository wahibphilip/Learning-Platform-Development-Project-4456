import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiHeadphones, FiFileText, FiHelpCircle, FiClock, FiEdit, FiTrash2 } = FiIcons;

const ContentItem = ({ item, onEdit, onDelete, onClick }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'video':
        return FiPlay;
      case 'audio':
        return FiHeadphones;
      case 'text':
        return FiFileText;
      case 'quiz':
        return FiHelpCircle;
      default:
        return FiFileText;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'video':
        return 'bg-red-100 text-red-600';
      case 'audio':
        return 'bg-purple-100 text-purple-600';
      case 'text':
        return 'bg-blue-100 text-blue-600';
      case 'quiz':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor()}`}>
            <SafeIcon icon={getIcon()} className="w-5 h-5" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{item.title}</h4>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-gray-500 capitalize">{item.type}</span>
              {item.duration && (
                <div className="flex items-center text-sm text-gray-500">
                  <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                  {item.duration}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {item.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
      )}
    </motion.div>
  );
};

export default ContentItem;