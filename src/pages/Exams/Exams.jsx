import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ExamBuilder from './ExamBuilder';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiFileText, FiClock, FiUsers, FiCheckCircle, FiEye } = FiIcons;

const Exams = () => {
  const [exams, setExams] = useState([
    {
      id: '1',
      title: 'React Fundamentals Final Exam',
      description: 'Comprehensive exam covering React basics, components, and state management',
      course: 'React Fundamentals',
      timeLimit: 60,
      totalQuestions: 25,
      totalPoints: 100,
      passingScore: 70,
      attempts: 245,
      averageScore: 78,
      status: 'active',
      createdAt: '2024-01-15',
      questions: []
    },
    {
      id: '2',
      title: 'JavaScript Advanced Concepts',
      description: 'Test your knowledge of advanced JavaScript concepts and ES6+ features',
      course: 'Advanced JavaScript',
      timeLimit: 90,
      totalQuestions: 30,
      totalPoints: 120,
      passingScore: 75,
      attempts: 189,
      averageScore: 82,
      status: 'active',
      createdAt: '2024-01-20',
      questions: []
    }
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const handleDelete = (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setExams(prev => prev.filter(e => e.id !== examId));
      toast.success('Exam deleted successfully');
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setShowBuilder(true);
  };

  const handleSaveExam = (examData) => {
    if (editingExam) {
      setExams(prev => prev.map(e => 
        e.id === editingExam.id ? { ...examData, id: editingExam.id } : e
      ));
      toast.success('Exam updated successfully');
    } else {
      setExams(prev => [...prev, { ...examData, id: Date.now().toString() }]);
      toast.success('Exam created successfully');
    }
    setShowBuilder(false);
    setEditingExam(null);
  };

  const handleCancelBuilder = () => {
    setShowBuilder(false);
    setEditingExam(null);
  };

  if (showBuilder) {
    return (
      <ExamBuilder
        exam={editingExam}
        onSave={handleSaveExam}
        onCancel={handleCancelBuilder}
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600 mt-1">Create and manage course assessments</p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Exam
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiFileText} className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                    <p className="text-sm text-gray-500">{exam.course}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  exam.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {exam.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{exam.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium">{exam.timeLimit} min</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiFileText} className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="text-sm font-medium">{exam.totalQuestions}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Attempts</p>
                    <p className="text-sm font-medium">{exam.attempts}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Avg Score</p>
                    <p className="text-sm font-medium">{exam.averageScore}%</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Passing Score</span>
                  <span className="font-medium">{exam.passingScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exam.passingScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Created {new Date(exam.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(exam)}
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(exam.id)}
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {exams.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiFileText} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exams yet</h3>
          <p className="text-gray-600 mb-4">Create your first exam to assess student knowledge</p>
          <Button onClick={() => setShowBuilder(true)}>
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Exams;