import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/common/Button';

const ExamForm = ({ exam, onClose, onSave }) => {
  const { courses } = useData();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: exam || {
      title: '',
      description: '',
      course: '',
      duration: 60,
      totalQuestions: 10,
      passingScore: 70,
      attempts: 0,
      averageScore: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const examData = {
        ...data,
        duration: parseInt(data.duration),
        totalQuestions: parseInt(data.totalQuestions),
        passingScore: parseInt(data.passingScore),
        attempts: exam?.attempts || 0,
        averageScore: exam?.averageScore || 0
      };
      onSave(examData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter exam title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Associated Course
          </label>
          <select
            {...register('course', { required: 'Course is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.title}>{course.title}</option>
            ))}
          </select>
          {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            {...register('duration', { 
              required: 'Duration is required',
              min: { value: 1, message: 'Duration must be at least 1 minute' }
            })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="60"
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Questions
          </label>
          <input
            {...register('totalQuestions', { 
              required: 'Total questions is required',
              min: { value: 1, message: 'Must have at least 1 question' }
            })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="10"
          />
          {errors.totalQuestions && <p className="mt-1 text-sm text-red-600">{errors.totalQuestions.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passing Score (%)
          </label>
          <input
            {...register('passingScore', { 
              required: 'Passing score is required',
              min: { value: 0, message: 'Score must be at least 0%' },
              max: { value: 100, message: 'Score cannot exceed 100%' }
            })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="70"
          />
          {errors.passingScore && <p className="mt-1 text-sm text-red-600">{errors.passingScore.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter exam description"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="flex items-center space-x-4 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (exam ? 'Update Exam' : 'Create Exam')}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ExamForm;