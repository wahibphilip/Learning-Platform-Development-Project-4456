import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Define available permissions
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  
  // Courses
  VIEW_COURSES: 'view_courses',
  CREATE_COURSES: 'create_courses',
  EDIT_COURSES: 'edit_courses',
  DELETE_COURSES: 'delete_courses',
  MANAGE_COURSE_CONTENT: 'manage_course_content',
  
  // Students
  VIEW_STUDENTS: 'view_students',
  CREATE_STUDENTS: 'create_students',
  EDIT_STUDENTS: 'edit_students',
  DELETE_STUDENTS: 'delete_students',
  VIEW_STUDENT_PROGRESS: 'view_student_progress',
  
  // Tutors
  VIEW_TUTORS: 'view_tutors',
  CREATE_TUTORS: 'create_tutors',
  EDIT_TUTORS: 'edit_tutors',
  DELETE_TUTORS: 'delete_tutors',
  
  // Exams
  VIEW_EXAMS: 'view_exams',
  CREATE_EXAMS: 'create_exams',
  EDIT_EXAMS: 'edit_exams',
  DELETE_EXAMS: 'delete_exams',
  GRADE_EXAMS: 'grade_exams',
  
  // Certificates
  VIEW_CERTIFICATES: 'view_certificates',
  ISSUE_CERTIFICATES: 'issue_certificates',
  REVOKE_CERTIFICATES: 'revoke_certificates',
  
  // Campaigns
  VIEW_CAMPAIGNS: 'view_campaigns',
  CREATE_CAMPAIGNS: 'create_campaigns',
  EDIT_CAMPAIGNS: 'edit_campaigns',
  DELETE_CAMPAIGNS: 'delete_campaigns',
  
  // Learning Paths
  VIEW_PATHS: 'view_paths',
  CREATE_PATHS: 'create_paths',
  EDIT_PATHS: 'edit_paths',
  DELETE_PATHS: 'delete_paths',
  
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  MANAGE_ROLES: 'manage_roles',
  
  // System
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_LOGS: 'view_logs',
  BACKUP_SYSTEM: 'backup_system',
};

// Define default roles with permissions
export const DEFAULT_ROLES = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: Object.values(PERMISSIONS),
    color: 'red',
    isSystemRole: true,
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Administrative access to most features',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.CREATE_COURSES,
      PERMISSIONS.EDIT_COURSES,
      PERMISSIONS.DELETE_COURSES,
      PERMISSIONS.MANAGE_COURSE_CONTENT,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.CREATE_STUDENTS,
      PERMISSIONS.EDIT_STUDENTS,
      PERMISSIONS.DELETE_STUDENTS,
      PERMISSIONS.VIEW_STUDENT_PROGRESS,
      PERMISSIONS.VIEW_TUTORS,
      PERMISSIONS.CREATE_TUTORS,
      PERMISSIONS.EDIT_TUTORS,
      PERMISSIONS.DELETE_TUTORS,
      PERMISSIONS.VIEW_EXAMS,
      PERMISSIONS.CREATE_EXAMS,
      PERMISSIONS.EDIT_EXAMS,
      PERMISSIONS.DELETE_EXAMS,
      PERMISSIONS.GRADE_EXAMS,
      PERMISSIONS.VIEW_CERTIFICATES,
      PERMISSIONS.ISSUE_CERTIFICATES,
      PERMISSIONS.VIEW_CAMPAIGNS,
      PERMISSIONS.CREATE_CAMPAIGNS,
      PERMISSIONS.EDIT_CAMPAIGNS,
      PERMISSIONS.DELETE_CAMPAIGNS,
      PERMISSIONS.VIEW_PATHS,
      PERMISSIONS.CREATE_PATHS,
      PERMISSIONS.EDIT_PATHS,
      PERMISSIONS.DELETE_PATHS,
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USERS,
      PERMISSIONS.EDIT_USERS,
    ],
    color: 'blue',
    isSystemRole: true,
  },
  instructor: {
    id: 'instructor',
    name: 'Instructor',
    description: 'Teaching and course management access',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.CREATE_COURSES,
      PERMISSIONS.EDIT_COURSES,
      PERMISSIONS.MANAGE_COURSE_CONTENT,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.VIEW_STUDENT_PROGRESS,
      PERMISSIONS.VIEW_EXAMS,
      PERMISSIONS.CREATE_EXAMS,
      PERMISSIONS.EDIT_EXAMS,
      PERMISSIONS.GRADE_EXAMS,
      PERMISSIONS.VIEW_CERTIFICATES,
      PERMISSIONS.ISSUE_CERTIFICATES,
      PERMISSIONS.VIEW_PATHS,
      PERMISSIONS.CREATE_PATHS,
      PERMISSIONS.EDIT_PATHS,
    ],
    color: 'green',
    isSystemRole: true,
  },
  content_creator: {
    id: 'content_creator',
    name: 'Content Creator',
    description: 'Content creation and management access',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.CREATE_COURSES,
      PERMISSIONS.EDIT_COURSES,
      PERMISSIONS.MANAGE_COURSE_CONTENT,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.VIEW_EXAMS,
      PERMISSIONS.CREATE_EXAMS,
      PERMISSIONS.EDIT_EXAMS,
      PERMISSIONS.VIEW_PATHS,
      PERMISSIONS.CREATE_PATHS,
      PERMISSIONS.EDIT_PATHS,
    ],
    color: 'purple',
    isSystemRole: true,
  },
  support: {
    id: 'support',
    name: 'Support Staff',
    description: 'Customer support and basic management access',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.EDIT_STUDENTS,
      PERMISSIONS.VIEW_STUDENT_PROGRESS,
      PERMISSIONS.VIEW_TUTORS,
      PERMISSIONS.VIEW_EXAMS,
      PERMISSIONS.VIEW_CERTIFICATES,
      PERMISSIONS.VIEW_CAMPAIGNS,
      PERMISSIONS.VIEW_PATHS,
    ],
    color: 'yellow',
    isSystemRole: true,
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to basic information',
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.VIEW_TUTORS,
      PERMISSIONS.VIEW_EXAMS,
      PERMISSIONS.VIEW_CERTIFICATES,
      PERMISSIONS.VIEW_CAMPAIGNS,
      PERMISSIONS.VIEW_PATHS,
    ],
    color: 'gray',
    isSystemRole: true,
  },
};

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [userRoles, setUserRoles] = useState({});

  useEffect(() => {
    // Load custom roles and user role assignments from localStorage
    const savedRoles = localStorage.getItem('customRoles');
    const savedUserRoles = localStorage.getItem('userRoles');
    
    if (savedRoles) {
      try {
        const customRoles = JSON.parse(savedRoles);
        setRoles(prev => ({ ...prev, ...customRoles }));
      } catch (error) {
        console.error('Error loading custom roles:', error);
      }
    }
    
    if (savedUserRoles) {
      try {
        setUserRoles(JSON.parse(savedUserRoles));
      } catch (error) {
        console.error('Error loading user roles:', error);
      }
    }
  }, []);

  const saveCustomRoles = (customRoles) => {
    const nonSystemRoles = Object.fromEntries(
      Object.entries(customRoles).filter(([_, role]) => !role.isSystemRole)
    );
    localStorage.setItem('customRoles', JSON.stringify(nonSystemRoles));
  };

  const saveUserRoles = (userRoleAssignments) => {
    localStorage.setItem('userRoles', JSON.stringify(userRoleAssignments));
  };

  const createRole = (roleData) => {
    const newRole = {
      ...roleData,
      id: roleData.id || Date.now().toString(),
      isSystemRole: false,
    };
    
    const updatedRoles = { ...roles, [newRole.id]: newRole };
    setRoles(updatedRoles);
    saveCustomRoles(updatedRoles);
    
    return newRole;
  };

  const updateRole = (roleId, updates) => {
    if (roles[roleId]?.isSystemRole) {
      throw new Error('Cannot modify system roles');
    }
    
    const updatedRoles = {
      ...roles,
      [roleId]: { ...roles[roleId], ...updates }
    };
    setRoles(updatedRoles);
    saveCustomRoles(updatedRoles);
  };

  const deleteRole = (roleId) => {
    if (roles[roleId]?.isSystemRole) {
      throw new Error('Cannot delete system roles');
    }
    
    const updatedRoles = { ...roles };
    delete updatedRoles[roleId];
    setRoles(updatedRoles);
    saveCustomRoles(updatedRoles);
    
    // Remove role assignments for deleted role
    const updatedUserRoles = { ...userRoles };
    Object.keys(updatedUserRoles).forEach(userId => {
      updatedUserRoles[userId] = updatedUserRoles[userId].filter(r => r !== roleId);
    });
    setUserRoles(updatedUserRoles);
    saveUserRoles(updatedUserRoles);
  };

  const assignRole = (userId, roleId) => {
    const updatedUserRoles = {
      ...userRoles,
      [userId]: [...(userRoles[userId] || []), roleId]
    };
    setUserRoles(updatedUserRoles);
    saveUserRoles(updatedUserRoles);
  };

  const removeRole = (userId, roleId) => {
    const updatedUserRoles = {
      ...userRoles,
      [userId]: (userRoles[userId] || []).filter(r => r !== roleId)
    };
    setUserRoles(updatedUserRoles);
    saveUserRoles(updatedUserRoles);
  };

  const getUserRoles = (userId) => {
    const roleIds = userRoles[userId] || [];
    return roleIds.map(roleId => roles[roleId]).filter(Boolean);
  };

  const getUserPermissions = (userId) => {
    const userRoleList = getUserRoles(userId);
    const permissions = new Set();
    
    userRoleList.forEach(role => {
      role.permissions.forEach(permission => permissions.add(permission));
    });
    
    return Array.from(permissions);
  };

  const hasPermission = (userId, permission) => {
    const userPermissions = getUserPermissions(userId);
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (userId, permissions) => {
    const userPermissions = getUserPermissions(userId);
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (userId, permissions) => {
    const userPermissions = getUserPermissions(userId);
    return permissions.every(permission => userPermissions.includes(permission));
  };

  const getCurrentUserPermissions = () => {
    if (!user) return [];
    return getUserPermissions(user.id);
  };

  const currentUserHasPermission = (permission) => {
    if (!user) return false;
    return hasPermission(user.id, permission);
  };

  const currentUserHasAnyPermission = (permissions) => {
    if (!user) return false;
    return hasAnyPermission(user.id, permissions);
  };

  const currentUserHasAllPermissions = (permissions) => {
    if (!user) return false;
    return hasAllPermissions(user.id, permissions);
  };

  const value = {
    roles,
    userRoles,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    removeRole,
    getUserRoles,
    getUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getCurrentUserPermissions,
    currentUserHasPermission,
    currentUserHasAnyPermission,
    currentUserHasAllPermissions,
    PERMISSIONS,
    DEFAULT_ROLES,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};