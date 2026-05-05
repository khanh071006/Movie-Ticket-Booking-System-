import type {Movie} from '../types';
import moviesData from '../../../mock/movies.json';

export const getMovies = (): Promise<Movie[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(moviesData as Movie[]);
        }, 800); // Giả lập mạng chậm 0.8s cho nó thật
    });
};

export const getMovieById = (id: number): Promise<Movie | undefined> => {
    return new Promise((resolve) => {
        const movie = moviesData.find(m => m.id === id);
        setTimeout(() => resolve(movie), 500);
    });
};