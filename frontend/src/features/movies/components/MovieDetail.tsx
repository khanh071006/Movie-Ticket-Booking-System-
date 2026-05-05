import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ChevronLeft, Clock, Languages, Loader2, Link as LinkIcon, Hash } from 'lucide-react';
import { getMovieById } from '../api/movieApi';
import type { Movie } from '../types';

export const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            if (!id) {
                setError('Không tìm thấy id phim.');
                setLoading(false);
                return;
            }

            try {
                const data = await getMovieById(id);
                setMovie(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin phim.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-red-500">
                <Loader2 className="animate-spin" />
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

    if (!movie) {
        return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white">Phim không tồn tại.</div>;
    }

    return (
        <div className="min-h-screen bg-[#0f1115] text-white">
            <div className="relative h-[50vh]">
                <img src={movie.posterUrl} className="w-full h-full object-cover opacity-20" alt="bg" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] to-transparent"></div>
                <button
                    onClick={() => navigate('/movies')}
                    className="absolute top-8 left-8 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition backdrop-blur-md"
                >
                    <ChevronLeft size={20} /> Quay lại
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-8 -mt-32 relative z-10 flex flex-col md:flex-row gap-10 pb-20">
                <img src={movie.posterUrl} className="w-72 md:w-80 rounded-2xl shadow-2xl border border-white/10" alt={movie.title} />
                <div className="flex-1 pt-10">
                    <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter italic text-red-500">{movie.title}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 text-sm">
                        <span className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                            <Hash size={16} /> {movie.id}
                        </span>
                        <span className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                            <Clock size={16} /> {movie.durationMinutes} phút
                        </span>
                        <span className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                            <Calendar size={16} /> {movie.releaseDate}
                        </span>
                        <span className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                            <Languages size={16} /> {movie.language}
                        </span>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-2xl">{movie.description}</p>
                    <a
                        href={movie.trailerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3 rounded-2xl shadow-xl shadow-red-600/30 transition-all active:scale-95 uppercase tracking-widest"
                    >
                        <LinkIcon size={16} /> Xem trailer
                    </a>
                </div>
            </div>
        </div>
    );
};
