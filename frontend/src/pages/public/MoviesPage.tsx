import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import type { Movie } from '../../types/app';

export const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        apiClient.movies.getAll().then(setMovies).catch(() => setMovies([]));
    }, []);

    const filtered = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return movies;
        return movies.filter((movie) => movie.title.toLowerCase().includes(q));
    }, [movies, keyword]);

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Movie Catalog</h1>
                    <p className="mt-1 text-slate-400">Dữ liệu trực tiếp từ API phim công khai.</p>
                </div>
                <input
                    className="h-10 w-full max-w-sm rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white outline-none focus:border-blue-400"
                    placeholder="Tìm phim theo tên..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((movie) => (
                    <Link key={movie.id} to={`/movies/${movie.id}`} className="group rounded-xl border border-white/10 bg-[#111111] p-3">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg">
                            <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <h3 className="mt-3 line-clamp-1 font-semibold text-white">{movie.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3.5 w-3.5" /> {movie.durationMinutes} phút
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};
