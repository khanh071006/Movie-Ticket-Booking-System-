const decodeBase64Url = (value: string): string => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return atob(padded);
};

interface JwtPayload {
    scope?: string;
}

export interface SessionAccount {
    id: string;
    email: string;
    fullName: string;
}

export const getStoredToken = (): string => localStorage.getItem('accessToken') ?? '';
export const getStoredUser = (): string => localStorage.getItem('currentUser') ?? '';

export const setStoredAccount = (account: SessionAccount): void => {
    localStorage.setItem('currentAccount', JSON.stringify(account));
};

export const getStoredAccount = (): SessionAccount | null => {
    const raw = localStorage.getItem('currentAccount');
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw) as SessionAccount;
    } catch {
        return null;
    }
};

export const getRolesFromToken = (token: string): string[] => {
    try {
        const parts = token.split('.');
        if (parts.length < 2) {
            return [];
        }

        const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
        if (!payload.scope) {
            return [];
        }
        return payload.scope.split(/\s+/).filter(Boolean);
    } catch {
        return [];
    }
};

export const hasAdminRole = (token: string): boolean => {
    const roles = getRolesFromToken(token);
    return roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
};

export const clearSession = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAccount');
};
