import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Loader2 } from 'lucide-react';
import { getMovies } from '../../features/movies/api/movieApi';
import type { Movie } from '../../features/movies/types';

export const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getMovies();
                setMovies(data.slice(0, 6));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-[#E50914]" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-8">
                <h1 className="text-3xl font-black text-white md:text-4xl">Chào mừng đến với MOVIE-APP</h1>
                <p className="mt-3 max-w-2xl text-[#A3A3A3]">Khám phá phim mới nhất, xem trailer và đặt vé nhanh chóng với giao diện cinematic dark.</p>
                <Link to="/movies" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#E50914] px-5 py-3 font-semibold text-white hover:bg-[#c50711]">
                    <Film size={18} /> Xem tất cả phim
                </Link>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-bold text-white">Phim nổi bật</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {movies.map((movie) => (
                        <Link key={movie.id} to={`/movies/${movie.id}`} className="group">
                            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10">
                                <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                            </div>
                            <p className="mt-2 line-clamp-1 text-sm text-white">{movie.title}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};
