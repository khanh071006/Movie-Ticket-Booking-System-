import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredToken, hasAdminRole } from '../features/auth/utils/session';

export const AdminGuard = ({ children }: { children: ReactNode }) => {
    const token = getStoredToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!hasAdminRole(token)) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
};
