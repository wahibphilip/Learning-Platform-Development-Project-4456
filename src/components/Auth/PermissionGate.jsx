import React from 'react';
import { useRole } from '../../contexts/RoleContext';

const PermissionGate = ({ 
  permissions = [], 
  requireAll = false, 
  fallback = null, 
  children 
}) => {
  const { currentUserHasPermission, currentUserHasAnyPermission, currentUserHasAllPermissions } = useRole();

  // If no permissions specified, render children
  if (permissions.length === 0) {
    return children;
  }

  // Single permission check
  if (permissions.length === 1) {
    return currentUserHasPermission(permissions[0]) ? children : fallback;
  }

  // Multiple permissions check
  const hasAccess = requireAll 
    ? currentUserHasAllPermissions(permissions)
    : currentUserHasAnyPermission(permissions);

  return hasAccess ? children : fallback;
};

export default PermissionGate;