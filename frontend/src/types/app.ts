export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    error?: string;
    details?: string[];
    timestamp?: string;
}

export interface Account {
    id: string;
    email: string;
    fullName: string;
    phone?: string | null;
    roles?: string[];
}

export interface AuthTokenInfo {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface AuthPayload {
    token?: AuthTokenInfo | null;
    tokenInfo?: AuthTokenInfo | null;
    account?: Account;
    accountInfo?: Account;
}

export interface Movie {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    releaseDate: string;
    language: string;
    posterUrl: string;
    trailerUrl: string;
}

export interface Cinema {
    id: string;
    name: string;
    address: string;
}

export interface Room {
    id: string;
    name: string;
    cinemaId: string;
}

export interface Showtime {
    id: string;
    startTime: string;
    endTime?: string;
    movie?: {
        id: string;
        title: string;
        durationMinutes: number;
    };
    room?: {
        id: string;
        name: string;
        cinema?: {
            id: string;
            name: string;
        };
    };
}

export interface CategoryItem {
    id: string;
    name: string;
}
