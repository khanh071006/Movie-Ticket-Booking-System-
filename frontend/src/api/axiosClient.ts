import axios, { AxiosError } from 'axios';
import type { Account, ApiResponse, AuthPayload, CategoryItem, Cinema, Movie, Room, Showtime } from '../types/app';
import { getStoredToken } from '../features/auth/utils/session';

const http = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
});

const authHeader = () => {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
    if (payload && typeof payload === 'object' && 'data' in payload) {
        return (payload as ApiResponse<T>).data;
    }
    return payload as T;
};

const parseError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;
        const details = axiosError.response?.data?.details?.join(', ');
        if (details) return details;
        if (axiosError.response?.data?.message) return axiosError.response.data.message;
        if (axiosError.response?.status === 401) return 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.';
        if (axiosError.response?.status === 403) return 'Bạn không có quyền thực hiện thao tác này.';
    }
    if (error instanceof Error) return error.message;
    return 'Có lỗi xảy ra, vui lòng thử lại.';
};

export const apiClient = {
    auth: {
        async login(email: string, password: string): Promise<{ token: string; account: Account }> {
            const response = await http.post<ApiResponse<AuthPayload>>('/auth/login', { email, password });
            const payload = unwrap(response.data);
            const token = payload.token?.accessToken ?? payload.tokenInfo?.accessToken ?? '';
            const account = payload.account ?? payload.accountInfo;
            if (!account) throw new Error('Thiếu thông tin tài khoản từ API.');
            return { token, account };
        },
        async register(data: { fullName: string; email: string; password: string; phone?: string }): Promise<void> {
            await http.post('/auth/register', data);
        },
    },
    accounts: {
        async getAll(): Promise<Account[]> {
            const response = await http.get<ApiResponse<Account[]>>('/accounts', { headers: authHeader() });
            return unwrap(response.data);
        },
        async create(payload: { fullName: string; email: string; password: string; phone?: string; roles?: string[] }): Promise<Account> {
            const response = await http.post<ApiResponse<Account>>('/accounts', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: string, payload: { fullName: string; phone?: string; roles?: string[] }): Promise<Account> {
            const response = await http.put<ApiResponse<Account>>(`/accounts/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: string): Promise<void> {
            await http.delete(`/accounts/${id}`, { headers: authHeader() });
        },
    },
    movies: {
        async getAll(): Promise<Movie[]> {
            const response = await http.get<ApiResponse<Movie[]>>('/movies');
            return unwrap(response.data);
        },
        async getById(id: string): Promise<Movie> {
            const response = await http.get<ApiResponse<Movie>>(`/movies/${id}`);
            return unwrap(response.data);
        },
        async create(payload: Omit<Movie, 'id'>): Promise<Movie> {
            const response = await http.post<ApiResponse<Movie>>('/movies', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: string, payload: Omit<Movie, 'id'>): Promise<Movie> {
            const response = await http.put<ApiResponse<Movie>>(`/movies/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: string): Promise<void> {
            await http.delete(`/movies/${id}`, { headers: authHeader() });
        },
    },
    cinemas: {
        async getAll(): Promise<Cinema[]> {
            const response = await http.get<Cinema[]>('/cinemas');
            return unwrap(response.data);
        },
        async create(payload: Omit<Cinema, 'id'>): Promise<Cinema> {
            const response = await http.post<Cinema>('/cinemas', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: string, payload: Omit<Cinema, 'id'>): Promise<Cinema> {
            const response = await http.put<Cinema>(`/cinemas/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: string): Promise<void> {
            await http.delete(`/cinemas/${id}`, { headers: authHeader() });
        },
    },
    rooms: {
        async getByCinema(cinemaId: string): Promise<Room[]> {
            const response = await http.get<Room[]>(`/rooms/cinema/${cinemaId}`);
            return unwrap(response.data);
        },
        async create(payload: Omit<Room, 'id'>): Promise<Room> {
            const response = await http.post<Room>('/rooms', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: string, payload: Omit<Room, 'id'>): Promise<Room> {
            const response = await http.put<Room>(`/rooms/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: string): Promise<void> {
            await http.delete(`/rooms/${id}`, { headers: authHeader() });
        },
    },
    showtimes: {
        async getByMovie(movieId: string): Promise<Showtime[]> {
            const response = await http.get<Showtime[]>(`/showtimes/movie/${movieId}`);
            return unwrap(response.data);
        },
        async getByMovieAndCinema(movieId: string, cinemaId: string): Promise<Showtime[]> {
            const response = await http.get<Showtime[]>(`/showtimes/movie/${movieId}/cinema/${cinemaId}`);
            return unwrap(response.data);
        },
        async create(payload: { movieId: string; roomId: string; startTime: string }): Promise<Showtime> {
            const response = await http.post<Showtime>('/showtimes', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: string): Promise<void> {
            await http.delete(`/showtimes/${id}`, { headers: authHeader() });
        },
    },
    categories: {
        async getAll(kind: 'directors' | 'genres' | 'movie-statuses' | 'cast-members'): Promise<CategoryItem[]> {
            const response = await http.get<ApiResponse<CategoryItem[]>>(`/${kind}`);
            return unwrap(response.data);
        },
        async create(kind: 'directors' | 'genres' | 'movie-statuses' | 'cast-members', name: string): Promise<CategoryItem> {
            const response = await http.post<ApiResponse<CategoryItem>>(`/${kind}`, { name }, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(kind: 'directors' | 'genres' | 'movie-statuses' | 'cast-members', id: string, name: string): Promise<CategoryItem> {
            const response = await http.put<ApiResponse<CategoryItem>>(`/${kind}/${id}`, { name }, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(kind: 'directors' | 'genres' | 'movie-statuses' | 'cast-members', id: string): Promise<void> {
            await http.delete(`/${kind}/${id}`, { headers: authHeader() });
        },
    },
};

export { parseError };
