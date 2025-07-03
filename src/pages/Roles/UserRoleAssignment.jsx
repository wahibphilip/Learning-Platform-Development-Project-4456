import React, { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/common/Button';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiX, FiUser, FiMail, FiCheck } = FiIcons;

const UserRoleAssignment = ({ role, onClose }) => {
  const { userRoles, assignRole, removeRole, getUserRoles } = useRole();
  const { students, tutors } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Combine all users (students and tutors)
  const allUsers = [
    ...students.map(student => ({ ...student, type: 'student' })),
    ...tutors.map(tutor => ({ ...tutor, type: 'tutor' }))
  ];

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usersWithRole = filteredUsers.filter(user => {
    const userRoleList = getUserRoles(user.id);
    return userRoleList.some(r => r.id === role.id);
  });

  const usersWithoutRole = filteredUsers.filter(user => {
    const userRoleList = getUserRoles(user.id);
    return !userRoleList.some(r => r.id === role.id);
  });

  const handleAssignRole = (userId) => {
    try {
      assignRole(userId, role.id);
      toast.success(`Role assigned successfully`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveRole = (userId) => {
    try {
      removeRole(userId, role.id);
      toast.success(`Role removed successfully`);
    } catch (error) {
      toast.error(error.message);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Role Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(role.color)}`}>
            <SafeIcon icon={FiUser} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{role.name}</h3>
            <p className="text-sm text-gray-600">{role.description}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {role.permissions.length} permissions • {usersWithRole.length} users assigned
        </div>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Users
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Search by name or email..."
        />
      </div>

      {/* Users with Role */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Users with this role ({usersWithRole.length})
        </h4>
        {usersWithRole.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {usersWithRole.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-green-200"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <SafeIcon icon={FiMail} className="w-3 h-3" />
                      <span>{user.email}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {user.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveRole(user.id)}
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No users assigned to this role yet</p>
          </div>
        )}
      </div>

      {/* Available Users */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Available Users ({usersWithoutRole.length})
        </h4>
        {usersWithoutRole.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {usersWithoutRole.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <SafeIcon icon={FiMail} className="w-3 h-3" />
                      <span>{user.email}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {user.type}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAssignRole(user.id)}
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                  Assign
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              {searchTerm ? 'No users found matching your search' : 'All users have been assigned this role'}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default UserRoleAssignment;