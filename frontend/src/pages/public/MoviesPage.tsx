import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Search } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import type { Movie } from '../../types/app';

export const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        apiClient.movies.getAll().then(setMovies).catch(() => setMovies([]));
    }, []);

    const getMoviePriority = (movie: Movie) => {
        const lang = movie.language ? movie.language.toLowerCase() : '';
        if (lang === 'english') return 1; // Hollywood (English) first
        if (lang === 'vietnamese') return 3; // Vietnamese last
        return 2; // Others in the middle
    };

    const filtered = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        const baseMovies = q
            ? movies.filter((movie) => movie.title.toLowerCase().includes(q))
            : movies;
            
        return [...baseMovies].sort((a, b) => getMoviePriority(a) - getMoviePriority(b));
    }, [movies, keyword]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 text-white font-sans selection:bg-blue-600/30">
            <div className="container mx-auto px-6 md:px-12">
                
                {/* Hero Banner Section */}
                <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950/30 border border-white/5 p-10 md:p-16 text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
                            Thư viện điện ảnh HUS
                        </span>
                        <h1 className="text-4xl font-black tracking-tight uppercase italic md:text-6xl">
                            DANH MỤC <span className="text-blue-500">PHIM</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            Khám phá danh sách đầy đủ các bộ phim bom tấn cực kỳ hấp dẫn đang có mặt tại hệ thống rạp HUSTheatre. 
                            Đặt vé và chọn ghế ngồi yêu thích của bạn ngay hôm nay!
                        </p>
                        
                        <div className="group relative w-full max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500" size={18} />
                            <input
                                type="text"
                                className="h-12 w-full rounded-full border border-white/10 bg-[#141414] pl-12 pr-4 text-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 text-white"
                                placeholder="Tìm phim theo tên..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Movies Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filtered.map((movie) => (
                            <Link
                                key={movie.id}
                                to={`/movies/${movie.id}`}
                                className="group flex flex-col transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/5 shadow-2xl">
                                    {movie.posterUrl ? (
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[#1A1A1A] text-gray-600">
                                            No Poster
                                        </div>
                                    )}

                                    {/* Language Badge */}
                                    <div className="absolute left-3 top-3 rounded border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                                        {movie.language}
                                    </div>

                                    {/* Quick Action Overlay */}
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-blue-900/90 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button className="w-full h-10 inline-flex items-center justify-center rounded-xl bg-blue-600 text-white text-xs font-black italic uppercase transition-all shadow-lg hover:bg-blue-500 cursor-pointer">
                                            Chi tiết & Đặt Vé
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1">
                                    <h3 className="line-clamp-1 text-base font-bold transition-colors group-hover:text-blue-500">
                                        {movie.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} className="text-blue-500" /> {movie.durationMinutes} phút
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-gray-600" />
                                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-zinc-950/40 rounded-3xl border border-white/5">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
                            🔍
                        </div>
                        <p className="text-gray-400">Không tìm thấy phim phù hợp với "{keyword}"</p>
                        <button
                            className="mt-4 text-blue-500 hover:text-blue-400 text-sm font-bold underline cursor-pointer"
                            onClick={() => setKeyword('')}
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

