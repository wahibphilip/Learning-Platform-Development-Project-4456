import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import TutorForm from './TutorForm';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiMail, FiStar, FiBook } = FiIcons;

const Tutors = () => {
  const { tutors, deleteTutor } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);

  const handleDelete = (tutorId) => {
    if (window.confirm('Are you sure you want to delete this tutor?')) {
      deleteTutor(tutorId);
      toast.success('Tutor deleted successfully');
    }
  };

  const handleEdit = (tutor) => {
    setEditingTutor(tutor);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTutor(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutors</h1>
          <p className="text-gray-600 mt-1">Manage your instructor team</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Tutor
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor, index) => (
          <motion.div
            key={tutor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <SafeIcon icon={FiMail} className="w-4 h-4 mr-1" />
                    {tutor.email}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Specialization</p>
                  <p className="text-sm text-gray-600">{tutor.specialization}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiBook} className="w-4 h-4 mr-1" />
                    Courses
                  </div>
                  <span className="font-medium">{tutor.courses.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiStar} className="w-4 h-4 mr-1" />
                    Rating
                  </div>
                  <span className="font-medium">{tutor.rating}/5</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  tutor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tutor.status}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tutor)}
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(tutor.id)}
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {tutors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiPlus} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first tutor</p>
          <Button onClick={() => setShowAddModal(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Tutor
          </Button>
        </motion.div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingTutor ? 'Edit Tutor' : 'Add New Tutor'}
        size="lg"
      >
        <TutorForm
          tutor={editingTutor}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Tutors;