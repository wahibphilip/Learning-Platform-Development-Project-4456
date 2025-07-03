import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/common/Button';

const CertificateForm = ({ certificate, onClose, onSave }) => {
  const { courses } = useData();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: certificate || {
      studentName: '',
      studentEmail: '',
      courseName: '',
      instructorName: '',
      completionDate: '',
      issueDate: new Date().toISOString().split('T')[0],
      certificateId: '',
      grade: 'A',
      score: 100,
      status: 'issued',
      isVerified: false
    }
  });

  const generateCertificateId = () => {
    const prefix = 'CERT';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${year}-${random}`;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const certificateData = {
        ...data,
        score: parseInt(data.score),
        certificateId: data.certificateId || generateCertificateId()
      };
      onSave(certificateData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>
            <input
              {...register('studentName', { required: 'Student name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Enter student name"
            />
            {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Email
            </label>
            <input
              {...register('studentEmail', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Enter student email"
            />
            {errors.studentEmail && <p className="mt-1 text-sm text-red-600">{errors.studentEmail.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <select
              {...register('courseName', { required: 'Course is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.title}>{course.title}</option>
              ))}
            </select>
            {errors.courseName && <p className="mt-1 text-sm text-red-600">{errors.courseName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor Name
            </label>
            <input
              {...register('instructorName', { required: 'Instructor name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Enter instructor name"
            />
            {errors.instructorName && <p className="mt-1 text-sm text-red-600">{errors.instructorName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completion Date
            </label>
            <input
              {...register('completionDate', { required: 'Completion date is required' })}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            />
            {errors.completionDate && <p className="mt-1 text-sm text-red-600">{errors.completionDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <input
              {...register('issueDate', { required: 'Issue date is required' })}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            />
            {errors.issueDate && <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade
            </label>
            <select
              {...register('grade')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score (%)
            </label>
            <input
              {...register('score', {
                required: 'Score is required',
                min: { value: 0, message: 'Score must be at least 0' },
                max: { value: 100, message: 'Score cannot exceed 100' }
              })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="100"
            />
            {errors.score && <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate ID
            </label>
            <input
              {...register('certificateId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Auto-generated if empty"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="issued">Issued</option>
              <option value="pending">Pending</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (certificate ? 'Update Certificate' : 'Issue Certificate')}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;