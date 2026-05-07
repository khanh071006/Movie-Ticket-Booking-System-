import { apiClient } from './axiosClient';
import type { Movie } from '../types/app';

export const getMovies = (): Promise<Movie[]> => apiClient.movies.getAll();
export const getMovieById = (id: string): Promise<Movie> => apiClient.movies.getById(id);
