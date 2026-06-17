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

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    error?: string;
    details?: string[];
    timestamp: string;
}
