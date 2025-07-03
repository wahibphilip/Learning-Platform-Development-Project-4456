import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiX, FiArrowUp, FiArrowDown } = FiIcons;

const PathForm = ({ path, onClose, onSave }) => {
  const { courses } = useData();
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState(path?.courses || []);

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

  const addCourse = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (course && !selectedCourses.find(c => c.id === courseId)) {
      setSelectedCourses([...selectedCourses, {
        id: course.id,
        title: course.title,
        duration: course.duration,
        level: course.level,
        order: selectedCourses.length
      }]);
    }
  };

  const removeCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
  };

  const moveCourse = (courseId, direction) => {
    const currentIndex = selectedCourses.findIndex(c => c.id === courseId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= selectedCourses.length) return;

    const newCourses = [...selectedCourses];
    [newCourses[currentIndex], newCourses[newIndex]] = [newCourses[newIndex], newCourses[currentIndex]];
    
    // Update order values
    newCourses.forEach((course, index) => {
      course.order = index;
    });

    setSelectedCourses(newCourses);
  };

  const calculateTotalDuration = () => {
    let totalWeeks = 0;
    selectedCourses.forEach(course => {
      const duration = course.duration.toLowerCase();
      if (duration.includes('week')) {
        totalWeeks += parseInt(duration.match(/\d+/)?.[0] || 0);
      } else if (duration.includes('month')) {
        totalWeeks += parseInt(duration.match(/\d+/)?.[0] || 0) * 4;
      }
    });
    
    if (totalWeeks >= 52) {
      return `${Math.round(totalWeeks / 52)} year${totalWeeks >= 104 ? 's' : ''}`;
    } else if (totalWeeks >= 4) {
      return `${Math.round(totalWeeks / 4)} month${totalWeeks >= 8 ? 's' : ''}`;
    } else {
      return `${totalWeeks} week${totalWeeks !== 1 ? 's' : ''}`;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const pathData = {
        ...data,
        courses: selectedCourses,
        duration: calculateTotalDuration(),
        enrolledStudents: parseInt(data.enrolledStudents) || 0,
        completionRate: parseInt(data.completionRate) || 0,
        totalCourses: selectedCourses.length
      };
      onSave(pathData);
    } finally {
      setLoading(false);
    }
  };

  const availableCourses = courses.filter(course => 
    !selectedCourses.find(selected => selected.id === course.id)
  );

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration
            </label>
            <input
              type="text"
              value={calculateTotalDuration()}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              placeholder="Auto-calculated"
            />
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
              Course Sequence ({selectedCourses.length} courses)
            </label>
            {availableCourses.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addCourse(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
              >
                <option value="">+ Add Course</option>
                {availableCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {selectedCourses.map((course, index) => (
              <div key={course.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => moveCourse(course.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={FiArrowUp} className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCourse(course.id, 'down')}
                    disabled={index === selectedCourses.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={FiArrowDown} className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {selectedCourses.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">No courses added yet</p>
                <p className="text-sm text-gray-500">Select courses from the dropdown above to build your learning path</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button type="submit" disabled={loading || selectedCourses.length === 0}>
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