import { useEffect, useState } from 'react';
import { getMovies } from '../api/movieApi';
import type {Movie} from '../types';
import { Film, Star, PlayCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MovieList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getMovies();
                setMovies(data);
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

    return (
        <div className="min-h-screen bg-[#0f1115] text-white p-8">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-red-500 tracking-tighter">
                    <Film /> HUST CINEMA
                </h1>
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold shadow-lg shadow-red-500/20">
                    AD
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {movies.map(movie => (
                    <div
                        key={movie.id}
                        onClick={() => navigate(`/movies/${movie.id}`)}
                        className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-white/5 shadow-xl cursor-pointer"
                    >
                        <div className="relative h-80">
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle size={60} className="text-red-500 shadow-2xl" />
                            </div>
                        </div>
                        <div className="p-5 bg-gradient-to-b from-gray-800 to-gray-900">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg leading-tight group-hover:text-red-500 transition-colors">{movie.title}</h3>
                                <span className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-1 rounded">
                  <Star size={14} className="mr-1 fill-current" /> {movie.rating}
                </span>
                            </div>
                            <p className="text-gray-400 text-sm">{movie.genre}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};