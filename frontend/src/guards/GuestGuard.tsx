import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredToken, hasAdminRole } from '../features/auth/utils/session';

export const GuestGuard = ({ children }: { children: ReactNode }) => {
    const token = getStoredToken();
    if (!token) {
        return <>{children}</>;
    }

    return <Navigate to={hasAdminRole(token) ? '/admin' : '/'} replace />;
};
