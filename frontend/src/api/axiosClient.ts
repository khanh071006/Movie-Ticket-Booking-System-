import axios, { AxiosError } from 'axios';
import type { Account, ApiResponse, AuthPayload, CategoryItem, Cinema, Movie, Room, Showtime, SeatType, TicketType, Seat, BookingRequest, BookingResponse, Snack } from '../types/app';
import { getStoredToken, clearSession } from '../features/auth/utils/session';

const http = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
    headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearSession();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

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
        async create(payload: Omit<Cinema, 'id' | 'stateName'>): Promise<Cinema> {
            const response = await http.post<Cinema>('/cinemas', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: string | number, payload: Omit<Cinema, 'id' | 'stateName'>): Promise<Cinema> {
            const response = await http.put<Cinema>(`/cinemas/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: string | number): Promise<void> {
            await http.delete(`/cinemas/${id}`, { headers: authHeader() });
        },
        async getPricing(cinemaId: string | number): Promise<import('../types/app').CinemaPricing> {
            const response = await http.get<ApiResponse<import('../types/app').CinemaPricing>>(`/cinemas/${cinemaId}/pricing`, { headers: authHeader() });
            return unwrap(response.data);
        },
        async updatePricing(cinemaId: string | number, payload: { ticketPrices: { ticketTypeId: number; price: number }[], seatPrices: { seatTypeId: number; surcharge: number }[] }): Promise<import('../types/app').CinemaPricing> {
            const response = await http.put<ApiResponse<import('../types/app').CinemaPricing>>(`/cinemas/${cinemaId}/pricing`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
    },
    rooms: {
        async getByCinema(cinemaId: string | number): Promise<Room[]> {
            const response = await http.get<Room[]>(`/rooms/cinema/${cinemaId}`);
            return unwrap(response.data);
        },
        async create(payload: Omit<Room, 'id'>): Promise<Room> {
            const response = await http.post<Room>('/rooms', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: string | number, payload: Omit<Room, 'id'>): Promise<Room> {
            const response = await http.put<Room>(`/rooms/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: string | number): Promise<void> {
            await http.delete(`/rooms/${id}`, { headers: authHeader() });
        },
        async getSeats(roomId: string | number): Promise<Seat[]> {
            const response = await http.get<ApiResponse<Seat[]> | Seat[]>(`/rooms/${roomId}/seats`);
            return unwrap(response.data);
        },
        async configureSeats(roomId: string | number, seats: { seatLocation: string; seatTypeId: number; roomId?: number }[]): Promise<Seat[]> {
            const response = await http.post<ApiResponse<Seat[]> | Seat[]>(`/rooms/${roomId}/seats`, seats, { headers: authHeader() });
            return unwrap(response.data);
        },
    },
    showtimes: {
        async getById(id: string): Promise<Showtime> {
            const response = await http.get<Showtime>(`/showtimes/${id}`);
            return unwrap(response.data);
        },
        async getByMovie(movieId: string): Promise<Showtime[]> {
            const response = await http.get<Showtime[]>(`/showtimes/movie/${movieId}`);
            return unwrap(response.data);
        },
        async getByMovieAndCinema(movieId: string, cinemaId: string | number): Promise<Showtime[]> {
            const response = await http.get<Showtime[]>(`/showtimes/movie/${movieId}/cinema/${cinemaId}`);
            return unwrap(response.data);
        },
        async getByDate(date: string): Promise<Showtime[]> {
            const response = await http.get<Showtime[]>(`/showtimes/date/${date}`);
            return unwrap(response.data);
        },
        async create(payload: { movieId: string; roomId: number; startTime: string }): Promise<Showtime> {
            const response = await http.post<Showtime>('/showtimes', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: string): Promise<void> {
            await http.delete(`/showtimes/${id}`, { headers: authHeader() });
        },
    },
    seatTypes: {
        async getAll(): Promise<SeatType[]> {
            const response = await http.get<ApiResponse<SeatType[]> | SeatType[]>('/seat-types', { headers: authHeader() });
            return unwrap(response.data);
        },
        async create(payload: { name: string; seatCount?: number }): Promise<SeatType> {
            const response = await http.post<ApiResponse<SeatType> | SeatType>('/seat-types', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: number, payload: { name: string; seatCount?: number }): Promise<SeatType> {
            const response = await http.put<ApiResponse<SeatType> | SeatType>(`/seat-types/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: number): Promise<void> {
            await http.delete(`/seat-types/${id}`, { headers: authHeader() });
        },
    },
    ticketTypes: {
        async getAll(): Promise<TicketType[]> {
            const response = await http.get<ApiResponse<TicketType[]> | TicketType[]>('/ticket-types', { headers: authHeader() });
            return unwrap(response.data);
        },
        async create(payload: { name: string; basePrice: number }): Promise<TicketType> {
            const response = await http.post<ApiResponse<TicketType> | TicketType>('/ticket-types', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: number, payload: { name: string; basePrice: number }): Promise<TicketType> {
            const response = await http.put<ApiResponse<TicketType> | TicketType>(`/ticket-types/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: number): Promise<void> {
            await http.delete(`/ticket-types/${id}`, { headers: authHeader() });
        },
    },
    bookings: {
        async create(payload: BookingRequest): Promise<BookingResponse> {
            const response = await http.post<ApiResponse<BookingResponse> | BookingResponse>('/bookings', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async getBookedSeats(showtimeId: string): Promise<number[]> {
            const response = await http.get<ApiResponse<number[]> | number[]>(`/bookings/showtime/${showtimeId}/booked-seats`);
            return unwrap(response.data);
        }
    },
    payments: {
        async createUrl(bookingId: string): Promise<string> {
            const response = await http.post<{ paymentUrl: string }>(`/payments/vnpay/create-url?bookingId=${bookingId}`, {}, { headers: authHeader() });
            return response.data.paymentUrl;
        }
    },
    snacks: {
        async getAll(): Promise<Snack[]> {
            const response = await http.get<ApiResponse<Snack[]> | Snack[]>('/snacks', { headers: authHeader() });
            return unwrap(response.data);
        },
        async create(payload: { snackTypeId: number; name: string; basePrice: number; imageUrl?: string }): Promise<Snack> {
            const response = await http.post<ApiResponse<Snack> | Snack>('/snacks', payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(id: number, payload: { snackTypeId: number; name: string; basePrice: number; imageUrl?: string }): Promise<Snack> {
            const response = await http.put<ApiResponse<Snack> | Snack>(`/snacks/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(id: number): Promise<void> {
            await http.delete(`/snacks/${id}`, { headers: authHeader() });
        },
    },
    categories: {
        async getAll(kind: 'directors' | 'genres' | 'movie-statuses' | 'cast-members' | 'states' | 'snack-types'): Promise<CategoryItem[]> {
            const response = await http.get<ApiResponse<CategoryItem[]>>(`/${kind}`);
            return unwrap(response.data);
        },
        async create(kind: 'directors' | 'genres' | 'movie-statuses' | 'cast-members' | 'states' | 'snack-types', payload: { name: string; imageUrl?: string }): Promise<CategoryItem> {
            const response = await http.post<ApiResponse<CategoryItem>>(`/${kind}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async update(kind: 'directors' | 'genres' | 'movie-statuses' | 'cast-members' | 'states' | 'snack-types', id: string, payload: { name: string; imageUrl?: string }): Promise<CategoryItem> {
            const response = await http.put<ApiResponse<CategoryItem>>(`/${kind}/${id}`, payload, { headers: authHeader() });
            return unwrap(response.data);
        },
        async remove(kind: 'directors' | 'genres' | 'movie-statuses' | 'cast-members' | 'states' | 'snack-types', id: string): Promise<void> {
            await http.delete(`/${kind}/${id}`, { headers: authHeader() });
        },
    },
};

export { parseError };
