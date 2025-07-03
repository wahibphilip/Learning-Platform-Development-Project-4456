import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRole, DEFAULT_ROLES } from '../../contexts/RoleContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SafeIcon from '../../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import RoleForm from './RoleForm';
import UserRoleAssignment from './UserRoleAssignment';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiUsers, FiShield, FiSettings, FiUserCheck } = FiIcons;

const RoleManagement = () => {
  const { roles, deleteRole, userRoles, getUserRoles } = useRole();
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showUserAssignment, setShowUserAssignment] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleDeleteRole = (roleId) => {
    if (roles[roleId]?.isSystemRole) {
      toast.error('Cannot delete system roles');
      return;
    }

    if (window.confirm('Are you sure you want to delete this role? Users with this role will lose their permissions.')) {
      try {
        deleteRole(roleId);
        toast.success('Role deleted successfully');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleEditRole = (role) => {
    if (role.isSystemRole) {
      toast.error('Cannot edit system roles');
      return;
    }
    setEditingRole(role);
    setShowRoleForm(true);
  };

  const handleManageUsers = (role) => {
    setSelectedRole(role);
    setShowUserAssignment(true);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colorMap[color] || colorMap.blue;
  };

  const getUserCountForRole = (roleId) => {
    return Object.values(userRoles).filter(roles => roles.includes(roleId)).length;
  };

  const formatPermissionName = (permission) => {
    return permission
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const roleList = Object.values(roles);
  const systemRoles = roleList.filter(role => role.isSystemRole);
  const customRoles = roleList.filter(role => !role.isSystemRole);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <Button onClick={() => setShowRoleForm(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </motion.div>

      {/* System Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">System Roles</h2>
          <p className="text-gray-600 text-sm">Built-in roles that cannot be modified</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(role.color)}`}>
                      <SafeIcon icon={FiShield} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        System Role
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{role.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Permissions</span>
                    <span className="font-medium">{role.permissions.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Users</span>
                    <span className="font-medium">{getUserCountForRole(role.id)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getColorClasses(role.color)}`}>
                      {role.color}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageUsers(role)}
                      >
                        <SafeIcon icon={FiUsers} className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Custom Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Custom Roles</h2>
          <p className="text-gray-600 text-sm">User-defined roles with custom permissions</p>
        </div>
        
        {customRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(role.color)}`}>
                        <SafeIcon icon={FiUserCheck} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          Custom Role
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{role.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Permissions</span>
                      <span className="font-medium">{role.permissions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Users</span>
                      <span className="font-medium">{getUserCountForRole(role.id)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getColorClasses(role.color)}`}>
                        {role.color}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageUsers(role)}
                        >
                          <SafeIcon icon={FiUsers} className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <SafeIcon icon={FiUserCheck} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No custom roles yet</h3>
            <p className="text-gray-600 mb-4">Create your first custom role to get started</p>
            <Button onClick={() => setShowRoleForm(true)}>
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Role Form Modal */}
      <Modal
        isOpen={showRoleForm}
        onClose={() => {
          setShowRoleForm(false);
          setEditingRole(null);
        }}
        title={editingRole ? 'Edit Role' : 'Create New Role'}
        size="xl"
      >
        <RoleForm
          role={editingRole}
          onClose={() => {
            setShowRoleForm(false);
            setEditingRole(null);
          }}
          onSave={() => {
            setShowRoleForm(false);
            setEditingRole(null);
          }}
        />
      </Modal>

      {/* User Role Assignment Modal */}
      <Modal
        isOpen={showUserAssignment}
        onClose={() => {
          setShowUserAssignment(false);
          setSelectedRole(null);
        }}
        title={`Manage Users - ${selectedRole?.name || ''}`}
        size="lg"
      >
        {selectedRole && (
          <UserRoleAssignment
            role={selectedRole}
            onClose={() => {
              setShowUserAssignment(false);
              setSelectedRole(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default RoleManagement;