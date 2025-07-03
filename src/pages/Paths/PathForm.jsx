import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiX } = FiIcons;

const PathForm = ({ path, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(path?.courses || ['']);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: path || {
      name: '',
      description: '',
      duration: '',
      level: 'Beginner',
      enrolledStudents: 0,
      completionRate: 0,
      status: 'active'
    }
  });

  const addCourse = () => {
    setCourses([...courses, '']);
  };

  const removeCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index, value) => {
    const newCourses = [...courses];
    newCourses[index] = value;
    setCourses(newCourses);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const pathData = {
        ...data,
        courses: courses.filter(course => course.trim() !== ''),
        enrolledStudents: parseInt(data.enrolledStudents) || 0,
        completionRate: parseInt(data.completionRate) || 0
      };
      onSave(pathData);
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
              Path Name
            </label>
            <input
              {...register('name', { required: 'Path name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Enter path name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              {...register('duration', { required: 'Duration is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="e.g., 6 months"
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              {...register('level')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Beginner to Advanced">Beginner to Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            placeholder="Enter path description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Course Sequence
            </label>
            <Button type="button" variant="outline" size="sm" onClick={addCourse}>
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
              Add Course
            </Button>
          </div>
          <div className="space-y-3">
            {courses.map((course, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => updateCourse(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  placeholder="Course name"
                />
                {courses.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCourse(index)}
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (path ? 'Update Path' : 'Create Path')}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PathForm;