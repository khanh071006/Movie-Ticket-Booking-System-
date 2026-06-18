import type { Account } from '../../../types/app';

interface JwtPayload {
    scope?: string;
}

const decodeBase64Url = (value: string): string => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return atob(padded);
};

export const getStoredToken = (): string => localStorage.getItem('accessToken') ?? '';

export const setStoredToken = (token: string): void => {
    localStorage.setItem('accessToken', token);
};

export const getStoredUser = (): string => localStorage.getItem('currentUser') ?? '';

export const setStoredUser = (fullName: string): void => {
    localStorage.setItem('currentUser', fullName);
};

export const setStoredAccount = (account: Account): void => {
    localStorage.setItem('currentAccount', JSON.stringify(account));
    setStoredUser(account.fullName);
};

export const getStoredAccount = (): Account | null => {
    const raw = localStorage.getItem('currentAccount');
    if (!raw) return null;
    try {
        return JSON.parse(raw) as Account;
    } catch {
        return null;
    }
};

export const getRolesFromToken = (token: string): string[] => {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return [];

        const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
        if (!payload.scope) return [];
        return payload.scope.split(/\s+/).filter(Boolean);
    } catch {
        return [];
    }
};

export const hasAdminRole = (token: string): boolean => {
    const roles = getRolesFromToken(token);
    return roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
};

export const hasStaffRole = (token: string): boolean => {
    const roles = getRolesFromToken(token);
    return roles.includes('ROLE_STAFF') || roles.includes('STAFF');
};

export const hasSuperAdminRole = (token: string): boolean => {
    const roles = getRolesFromToken(token);
    return roles.includes('ROLE_SUPERADMIN') || roles.includes('SUPERADMIN');
};

export const hasManagerRole = (token: string): boolean => {
    const roles = getRolesFromToken(token);
    return roles.includes('ROLE_MANAGER') || roles.includes('MANAGER');
};

export const hasBackofficeAccess = (token: string): boolean => {
    return hasAdminRole(token) || hasStaffRole(token) || hasSuperAdminRole(token) || hasManagerRole(token);
};

export const isLoggedIn = (): boolean => Boolean(getStoredToken());

export const clearSession = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAccount');
};
