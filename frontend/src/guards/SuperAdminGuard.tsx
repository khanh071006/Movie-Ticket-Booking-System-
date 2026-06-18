import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredToken, hasSuperAdminRole } from '../features/auth/utils/session';

export const SuperAdminGuard = ({ children }: { children: ReactNode }) => {
    const token = getStoredToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!hasSuperAdminRole(token)) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
};
