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
    ageRestriction: number;
    director?: { id: string; name: string; imageUrl?: string };
    movieStatus?: { id: string; name: string };
    castMembers?: { id: string; name: string; imageUrl?: string }[];
    genres?: { id: string; name: string }[];
}

export interface Cinema {
    id: number;
    name: string;
    address: string;
    city: string;
    stateId?: number;
    stateName?: string;
}

export interface Room {
    id: number;
    name: string;
    cinemaId: number;
}

export interface Showtime {
    id: string;
    startTime: string;
    endTime?: string;
    movie?: {
        id: string;
        title: string;
        durationMinutes: number;
        posterUrl?: string;
        ageRestriction?: number;
    };
    room?: {
        id: number;
        name: string;
        cinema?: {
            id: number;
            name: string;
            city?: string;
        };
    };
}

export interface CategoryItem {
    id: string;
    name: string;
    imageUrl?: string;
}

export interface SeatType {
    id: number;
    name: string;
    seatCount?: number;
}

export interface TicketType {
    id: number;
    name: string;
    basePrice: number;
}

export interface State {
    id: number;
    name: string;
}

export interface SnackType {
    id: number;
    name: string;
}

export interface Snack {
    id: number;
    snackTypeId: number;
    snackTypeName?: string;
    name: string;
    basePrice: number;
    imageUrl?: string;
}

export interface Seat {
    id?: number;
    seatLocation: string;
    seatTypeId: number;
    seatTypeName?: string;
    roomId?: number;
    seatCount?: number;
}

export interface BookingTicketRequest {
    ticketTypeId: number;
    quantity: number;
}

export interface BookingSnackRequest {
    snackId: number;
    quantity: number;
}

export interface BookingRequest {
    showtimeId: string;
    seatIds: number[];
    ticketQuantities: BookingTicketRequest[];
    snackQuantities?: BookingSnackRequest[];
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
    snacks?: string[];
}

export interface TicketPrice {
    ticketTypeId: number;
    ticketTypeName?: string;
    price: number;
}

export interface SeatPrice {
    seatTypeId: number;
    seatTypeName?: string;
    surcharge: number;
}

export interface CinemaPricing {
    cinemaId: string;
    ticketPrices: TicketPrice[];
    seatPrices: SeatPrice[];
}
