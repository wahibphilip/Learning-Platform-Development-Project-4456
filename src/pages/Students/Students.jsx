import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import StudentForm from './StudentForm';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiMail, FiCalendar, FiBook } = FiIcons;

const Students = () => {
  const { students, deleteStudent } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(studentId);
      toast.success('Student deleted successfully');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage your student database</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <SafeIcon icon={FiMail} className="w-4 h-4 mr-1" />
                    {student.email}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiBook} className="w-4 h-4 mr-1" />
                    Enrolled Courses
                  </div>
                  <span className="font-medium">{student.enrolledCourses.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                    Join Date
                  </div>
                  <span className="font-medium">{new Date(student.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.status}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(student)}
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(student.id)}
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {students.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiPlus} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first student</p>
          <Button onClick={() => setShowAddModal(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </motion.div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <StudentForm
          student={editingStudent}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Students;