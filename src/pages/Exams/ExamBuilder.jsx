import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SafeIcon from '../../components/common/SafeIcon';
import QuestionBuilder from '../../components/QuestionBuilder/QuestionBuilder';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiSave, FiEye, FiDownload, FiUpload, FiArrowLeft } = FiIcons;

const ExamBuilder = ({ exam, onSave, onCancel }) => {
  const [examData, setExamData] = useState(exam || {
    title: '',
    description: '',
    instructions: '',
    timeLimit: 60,
    shuffleQuestions: false,
    showResults: true,
    allowRetake: false,
    passingScore: 70,
    questions: []
  });

  const [activeTab, setActiveTab] = useState('settings');

  const handleExamChange = (field, value) => {
    setExamData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: '',
      timeLimit: 60
    };
    
    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId, updatedQuestion) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? updatedQuestion : q
      )
    }));
  };

  const deleteQuestion = (questionId) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSave = () => {
    if (!examData.title.trim()) {
      toast.error('Please enter an exam title');
      return;
    }
    
    if (examData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const totalPoints = examData.questions.reduce((sum, q) => sum + q.points, 0);
    const examToSave = {
      ...examData,
      totalPoints,
      totalQuestions: examData.questions.length,
      createdAt: exam?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(examToSave);
    toast.success('Exam saved successfully!');
  };

  const exportExam = () => {
    const dataStr = JSON.stringify(examData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${examData.title || 'exam'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importExam = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedExam = JSON.parse(e.target.result);
          setExamData(importedExam);
          toast.success('Exam imported successfully!');
        } catch (error) {
          toast.error('Invalid exam file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'settings', label: 'Exam Settings', icon: FiSave },
    { id: 'questions', label: 'Questions', icon: FiEye },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {exam ? 'Edit Exam' : 'Create New Exam'}
          </h1>
          <p className="text-gray-600 mt-1">Build comprehensive assessments</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".json"
            onChange={importExam}
            className="hidden"
            id="import-exam"
          />
          <label htmlFor="import-exam">
            <Button variant="outline" size="sm" as="span">
              <SafeIcon icon={FiUpload} className="w-4 h-4 mr-1" />
              Import
            </Button>
          </label>
          
          <Button variant="outline" size="sm" onClick={exportExam}>
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
            Export
          </Button>
          
          <Button variant="outline" onClick={onCancel}>
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button onClick={handleSave}>
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Save Exam
          </Button>
        </div>
      </motion.div>

      <Card className="p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4 mr-2 inline" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title
                </label>
                <input
                  type="text"
                  value={examData.title}
                  onChange={(e) => handleExamChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter exam title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={examData.timeLimit}
                  onChange={(e) => handleExamChange('timeLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                  max="480"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  value={examData.passingScore}
                  onChange={(e) => handleExamChange('passingScore', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={examData.description}
                onChange={(e) => handleExamChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Enter exam description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                value={examData.instructions}
                onChange={(e) => handleExamChange('instructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Enter exam instructions for students"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={examData.shuffleQuestions}
                    onChange={(e) => handleExamChange('shuffleQuestions', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Shuffle Questions</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={examData.showResults}
                    onChange={(e) => handleExamChange('showResults', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Results After Completion</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={examData.allowRetake}
                    onChange={(e) => handleExamChange('allowRetake', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow Retakes</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Questions ({examData.questions.length})
                </h3>
                <p className="text-sm text-gray-600">
                  Total Points: {examData.questions.reduce((sum, q) => sum + q.points, 0)}
                </p>
              </div>
              
              <Button onClick={addQuestion}>
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {examData.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <QuestionBuilder
                    question={question}
                    onChange={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                    onDelete={() => deleteQuestion(question.id)}
                  />
                </motion.div>
              ))}
              
              {examData.questions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">No questions added yet</p>
                  <Button onClick={addQuestion}>
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Add Your First Question
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamBuilder;