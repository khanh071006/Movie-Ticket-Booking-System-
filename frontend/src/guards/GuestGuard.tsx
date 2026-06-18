import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredToken, hasSuperAdminRole, hasManagerRole, hasStaffRole } from '../features/auth/utils/session';

export const GuestGuard = ({ children }: { children: ReactNode }) => {
    const token = getStoredToken();

    if (token) {
        if (hasSuperAdminRole(token)) return <Navigate to="/superadmin" replace />;
        if (hasManagerRole(token)) return <Navigate to="/manager" replace />;
        if (hasStaffRole(token)) return <Navigate to="/staff" replace />;
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
