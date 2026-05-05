import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Film, Languages, Loader2, PlayCircle } from 'lucide-react';
import { getMovies } from '../api/movieApi';
import type { Movie } from '../types';

export const MovieList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getMovies();
                setMovies(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách phim.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
                <Loader2 className="animate-spin text-red-500" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f1115] text-white p-8 flex items-center justify-center">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-red-300">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1115] text-white p-8">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-red-500 tracking-tighter">
                    <Film /> HUST CINEMA
                </h1>
                <div className="text-sm text-gray-300">Tổng phim: {movies.length}</div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        onClick={() => navigate(`/movies/${movie.id}`)}
                        className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-white/5 shadow-xl cursor-pointer"
                    >
                        <div className="relative h-80">
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-30 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle size={60} className="text-red-500 shadow-2xl" />
                            </div>
                        </div>
                        <div className="p-5 bg-gradient-to-b from-gray-800 to-gray-900">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-red-500 transition-colors mb-2">{movie.title}</h3>
                            <div className="space-y-2 text-sm text-gray-300">
                                <p className="line-clamp-2 text-gray-400">{movie.description}</p>
                                <p className="flex items-center gap-2"><Clock size={16} /> {movie.durationMinutes} phút</p>
                                <p className="flex items-center gap-2"><Calendar size={16} /> {movie.releaseDate}</p>
                                <p className="flex items-center gap-2"><Languages size={16} /> {movie.language}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
