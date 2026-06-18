import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredToken, hasStaffRole } from '../features/auth/utils/session';

export const StaffGuard = ({ children }: { children: ReactNode }) => {
    const token = getStoredToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!hasStaffRole(token)) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
};
