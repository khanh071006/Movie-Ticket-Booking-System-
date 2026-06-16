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
    director?: { id: string; name: string };
    movieStatus?: { id: string; name: string };
    castMembers?: { id: string; name: string }[];
    genres?: { id: string; name: string }[];
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

export interface SeatType {
    id: number;
    name: string;
}

export interface TicketType {
    id: number;
    name: string;
    basePrice: number;
}

export interface Seat {
    id?: number;
    seatLocation: string;
    seatTypeId: number;
    seatTypeName?: string;
    roomId?: number;
}

export interface BookingTicketRequest {
    ticketTypeId: number;
    quantity: number;
}

export interface BookingRequest {
    showtimeId: string;
    seatIds: number[];
    ticketQuantities: BookingTicketRequest[];
}

export interface BookingResponse {
    id: string;
    showtimeId: string;
    movieTitle: string;
    bookingTime: string;
    totalAmount: number;
    paymentStatus: string;
    seatLocations: string[];
    tickets: string[];
}
