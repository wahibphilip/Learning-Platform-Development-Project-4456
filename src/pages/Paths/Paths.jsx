import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import PathForm from './PathForm';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiMap, FiBook, FiUsers, FiClock } = FiIcons;

const Paths = () => {
  const [paths, setPaths] = useState([
    {
      id: '1',
      name: 'Frontend Development Path',
      description: 'Complete frontend development journey from beginner to advanced',
      courses: ['HTML/CSS Basics', 'JavaScript Fundamentals', 'React Development', 'Advanced React'],
      duration: '6 months',
      level: 'Beginner to Advanced',
      enrolledStudents: 156,
      completionRate: 78,
      status: 'active'
    },
    {
      id: '2',
      name: 'Backend Development Path',
      description: 'Master backend development with Node.js and databases',
      courses: ['Node.js Basics', 'Express.js', 'Database Design', 'API Development'],
      duration: '4 months',
      level: 'Intermediate',
      enrolledStudents: 89,
      completionRate: 85,
      status: 'active'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPath, setEditingPath] = useState(null);

  const handleDelete = (pathId) => {
    if (window.confirm('Are you sure you want to delete this learning path?')) {
      setPaths(prev => prev.filter(p => p.id !== pathId));
      toast.success('Learning path deleted successfully');
    }
  };

  const handleEdit = (path) => {
    setEditingPath(path);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPath(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
          <p className="text-gray-600 mt-1">Create structured learning journeys</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Path
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiMap} className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{path.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      path.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {path.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{path.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                    Duration
                  </div>
                  <span className="font-medium">{path.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiBook} className="w-4 h-4 mr-1" />
                    Courses
                  </div>
                  <span className="font-medium">{path.courses.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 mr-1" />
                    Enrolled
                  </div>
                  <span className="font-medium">{path.enrolledStudents}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Completion Rate</span>
                  <span className="font-medium">{path.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${path.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Course Sequence</h4>
                <div className="space-y-2">
                  {path.courses.slice(0, 3).map((course, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                        {idx + 1}
                      </span>
                      {course}
                    </div>
                  ))}
                  {path.courses.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{path.courses.length - 3} more courses
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  path.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  path.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {path.level}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(path)}
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(path.id)}
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {paths.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiMap} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No learning paths yet</h3>
          <p className="text-gray-600 mb-4">Create your first structured learning path</p>
          <Button onClick={() => setShowAddModal(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create Path
          </Button>
        </motion.div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingPath ? 'Edit Learning Path' : 'Create New Learning Path'}
        size="lg"
      >
        <PathForm
          path={editingPath}
          onClose={handleCloseModal}
          onSave={(pathData) => {
            if (editingPath) {
              setPaths(prev => prev.map(p => 
                p.id === editingPath.id ? { ...p, ...pathData } : p
              ));
              toast.success('Learning path updated successfully');
            } else {
              setPaths(prev => [...prev, { ...pathData, id: Date.now().toString() }]);
              toast.success('Learning path created successfully');
            }
            handleCloseModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default Paths;