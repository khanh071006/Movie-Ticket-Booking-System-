import axios, { AxiosError } from 'axios';

interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    error?: string;
    details?: string[];
}

interface TokenInfo {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

interface AccountInfo {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
}

interface AuthPayload {
    token: TokenInfo | null;
    account: AccountInfo;
}

export interface LoginResponse {
    user: string;
    token: string;
    account: AccountInfo;
}

interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

const authApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

const buildErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;
        const responseData = axiosError.response?.data;
        const detailMessage = responseData?.details?.join(', ');
        if (detailMessage) {
            return detailMessage;
        }
        if (responseData?.message) {
            return responseData.message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Đã xảy ra lỗi, vui lòng thử lại.';
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await authApi.post<ApiResponse<AuthPayload>>('/auth/login', { email, password });
        const payload = response.data.data;

        return {
            user: payload.account.fullName,
            token: payload.token?.accessToken ?? '',
            account: payload.account,
        };
    } catch (error) {
        throw new Error(buildErrorMessage(error));
    }
};

export const signup = async (data: RegisterRequest): Promise<void> => {
    try {
        await authApi.post<ApiResponse<AuthPayload>>('/auth/register', data);
    } catch (error) {
        throw new Error(buildErrorMessage(error));
    }
};
