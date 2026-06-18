import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredToken, hasManagerRole } from '../features/auth/utils/session';

export const ManagerGuard = ({ children }: { children: ReactNode }) => {
    const token = getStoredToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!hasManagerRole(token)) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
};
