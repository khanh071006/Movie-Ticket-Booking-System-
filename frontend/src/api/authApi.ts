import { apiClient } from './axiosClient';
import type { Account } from '../types/app';

export const login = (email: string, password: string): Promise<{ token: string; account: Account }> =>
    apiClient.auth.login(email, password);

export const register = (data: { fullName: string; email: string; password: string; phone?: string }): Promise<void> =>
    apiClient.auth.register(data);
