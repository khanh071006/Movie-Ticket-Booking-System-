const decodeBase64Url = (value: string): string => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return atob(padded);
};

interface JwtPayload {
    scope?: string;
    sub?: string;
}

export const getStoredToken = (): string => localStorage.getItem('accessToken') ?? '';
export const getStoredUser = (): string => localStorage.getItem('currentUser') ?? '';

export interface SessionAccount {
    id?: string;
    email?: string;
    fullName?: string;
    phone?: string;
}

export const setStoredAccount = (account: SessionAccount): void => {
    localStorage.setItem('currentAccount', JSON.stringify(account));
};

export const getStoredAccount = (): SessionAccount | null => {
    const value = localStorage.getItem('currentAccount');
    if (!value) {
        return null;
    }
    try {
        return JSON.parse(value) as SessionAccount;
    } catch {
        return null;
    }
};

export const getTokenPayload = (token: string): JwtPayload | null => {
    try {
        const parts = token.split('.');
        if (parts.length < 2) {
            return null;
        }

        const json = decodeBase64Url(parts[1]);
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
};

export const getRolesFromToken = (token: string): string[] => {
    const payload = getTokenPayload(token);
    const scope = payload?.scope?.trim();
    if (!scope) {
        return [];
    }

    return scope.split(/\s+/).filter(Boolean);
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
