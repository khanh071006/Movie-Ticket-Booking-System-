import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../api/movieApi';
import type {Movie} from '../types';
import { ChevronLeft, Clock, Calendar, Star, Loader2 } from 'lucide-react';

export const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | undefined>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            if (id) {
                const data = await getMovieById(Number(id));
                setMovie(data);
            }
            setLoading(false);
        };
        fetchMovie();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-red-500"><Loader2 className="animate-spin" /></div>;
    if (!movie) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white">Phim không tồn tại.</div>;

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

            <div className="max-w-6xl mx-auto px-8 -mt-32 relative z-10 flex flex-col md:row gap-10 pb-20">
                <img src={movie.posterUrl} className="w-72 md:w-80 rounded-2xl shadow-2xl border border-white/10" alt={movie.title} />
                <div className="flex-1 pt-10">
                    <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter italic text-red-500">{movie.title}</h1>
                    <div className="flex flex-wrap gap-4 mb-8 text-sm">
             <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg font-bold">
               <Star size={18} className="fill-current" /> {movie.rating}
             </span>
                        <span className="flex items-center gap-1 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
               <Clock size={18} /> {movie.duration} phút
             </span>
                        <span className="flex items-center gap-1 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
               <Calendar size={18} /> {movie.releaseDate}
             </span>
                        <span className="bg-white text-black px-4 py-1.5 rounded-lg font-black uppercase text-xs tracking-widest">{movie.genre}</span>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl">{movie.description}</p>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all active:scale-95 uppercase tracking-widest">
                        ĐẶT VÉ NGAY
                    </button>
                </div>
            </div>
        </div>
    );
};