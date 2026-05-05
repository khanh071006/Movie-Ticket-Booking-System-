export interface Movie {
    id: number;
    title: string;
    description: string;
    director: string;
    cast: string;
    duration: number; // phút
    releaseDate: string;
    posterUrl: string;
    rating: number;
    genre: string;
}