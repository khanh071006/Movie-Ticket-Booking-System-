import axios from 'axios';
import type { ApiResponse, Movie } from '../types';

const movieApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getMovies = async (): Promise<Movie[]> => {
    const response = await movieApi.get<ApiResponse<Movie[]>>('/movies');
    return response.data.data;
};

export const getMovieById = async (id: string): Promise<Movie> => {
    const response = await movieApi.get<ApiResponse<Movie>>(`/movies/${id}`);
    return response.data.data;
};
