import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRole, PERMISSIONS } from '../../contexts/RoleContext';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiCheck, FiX } = FiIcons;

const RoleForm = ({ role, onClose, onSave }) => {
  const { createRole, updateRole } = useRole();
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(
    role?.permissions || []
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: role || {
      name: '',
      description: '',
      color: 'blue',
    }
  });

  const permissionGroups = {
    'Dashboard & Analytics': [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_ANALYTICS,
    ],
    'Course Management': [
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.CREATE_COURSES,
      PERMISSIONS.EDIT_COURSES,
      PERMISSIONS.DELETE_COURSES,
      PERMISSIONS.MANAGE_COURSE_CONTENT,
    ],
    'Student Management': [
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.CREATE_STUDENTS,
      PERMISSIONS.EDIT_STUDENTS,
      PERMISSIONS.DELETE_STUDENTS,
      PERMISSIONS.VIEW_STUDENT_PROGRESS,
    ],
    'Tutor Management': [
      PERMISSIONS.VIEW_TUTORS,
      PERMISSIONS.CREATE_TUTORS,
      PERMISSIONS.EDIT_TUTORS,
      PERMISSIONS.DELETE_TUTORS,
    ],
    'Exam Management': [
      PERMISSIONS.VIEW_EXAMS,
      PERMISSIONS.CREATE_EXAMS,
      PERMISSIONS.EDIT_EXAMS,
      PERMISSIONS.DELETE_EXAMS,
      PERMISSIONS.GRADE_EXAMS,
    ],
    'Certificate Management': [
      PERMISSIONS.VIEW_CERTIFICATES,
      PERMISSIONS.ISSUE_CERTIFICATES,
      PERMISSIONS.REVOKE_CERTIFICATES,
    ],
    'Campaign Management': [
      PERMISSIONS.VIEW_CAMPAIGNS,
      PERMISSIONS.CREATE_CAMPAIGNS,
      PERMISSIONS.EDIT_CAMPAIGNS,
      PERMISSIONS.DELETE_CAMPAIGNS,
    ],
    'Learning Path Management': [
      PERMISSIONS.VIEW_PATHS,
      PERMISSIONS.CREATE_PATHS,
      PERMISSIONS.EDIT_PATHS,
      PERMISSIONS.DELETE_PATHS,
    ],
    'User & Role Management': [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USERS,
      PERMISSIONS.EDIT_USERS,
      PERMISSIONS.DELETE_USERS,
      PERMISSIONS.MANAGE_ROLES,
    ],
    'System Management': [
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.VIEW_LOGS,
      PERMISSIONS.BACKUP_SYSTEM,
    ],
  };

  const colors = [
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Purple', value: 'purple' },
    { name: 'Red', value: 'red' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Pink', value: 'pink' },
    { name: 'Gray', value: 'gray' },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      pink: 'bg-pink-100 text-pink-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    return colorMap[color] || colorMap.blue;
  };

  const togglePermission = (permission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const toggleGroupPermissions = (groupPermissions) => {
    const allSelected = groupPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions(prev => 
        prev.filter(p => !groupPermissions.includes(p))
      );
    } else {
      setSelectedPermissions(prev => {
        const newPermissions = new Set([...prev, ...groupPermissions]);
        return Array.from(newPermissions);
      });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const roleData = {
        ...data,
        permissions: selectedPermissions,
      };

      if (role) {
        updateRole(role.id, roleData);
        toast.success('Role updated successfully');
      } else {
        createRole(roleData);
        toast.success('Role created successfully');
      }

      onSave && onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatPermissionName = (permission) => {
    return permission
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-white max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name
            </label>
            <input
              {...register('name', { required: 'Role name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              placeholder="Enter role name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <select
              {...register('color')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {colors.map(color => (
                <option key={color.value} value={color.value}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            placeholder="Enter role description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Permissions ({selectedPermissions.length} selected)
          </label>
          
          <div className="space-y-6">
            {Object.entries(permissionGroups).map(([groupName, groupPermissions]) => {
              const selectedCount = groupPermissions.filter(p => 
                selectedPermissions.includes(p)
              ).length;
              const allSelected = selectedCount === groupPermissions.length;
              const someSelected = selectedCount > 0 && selectedCount < groupPermissions.length;

              return (
                <div key={groupName} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{groupName}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {selectedCount}/{groupPermissions.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleGroupPermissions(groupPermissions)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          allSelected 
                            ? 'bg-primary-600 border-primary-600' 
                            : someSelected 
                            ? 'bg-primary-100 border-primary-600' 
                            : 'border-gray-300'
                        }`}
                      >
                        {allSelected && <SafeIcon icon={FiCheck} className="w-3 h-3 text-white" />}
                        {someSelected && <div className="w-2 h-2 bg-primary-600 rounded-sm" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {groupPermissions.map(permission => (
                      <label
                        key={permission}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">
                          {formatPermissionName(permission)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (role ? 'Update Role' : 'Create Role')}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;