import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Play, TrendingUp, Search, Info } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import type { Movie } from '../../types/app';
import { Button } from '../../components/ui/Button';

export const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        // Fetch all movies on component mount
        apiClient.movies.getAll()
            .then(setMovies)
            .catch((err) => {
                console.error('Failed to fetch movies:', err);
                setMovies([]);
            });
    }, []);

    const filteredMovies = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return movies;
        return movies.filter((movie) =>
            movie.title.toLowerCase().includes(q) ||
            movie.description.toLowerCase().includes(q)
        );
    }, [movies, keyword]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] pb-20 text-white">
            {/* Hero Section: High-impact cinematic entrance */}
            <section className="relative flex h-[85vh] w-full items-center overflow-hidden">
                {/* Gradient Overlays for readability and depth */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

                <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2025"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10000ms] hover:scale-110"
                    alt="Cinema Backdrop"
                />

                <div className="container relative z-20 mx-auto px-6 md:px-12">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/50 bg-blue-600/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
                        <TrendingUp size={14} />
                        <span>Trải nghiệm cao cấp</span>
                    </div>

                    <h1 className="mb-6 max-w-3xl text-6xl font-black leading-none tracking-tighter md:text-8xl">
                        KIỆT TÁC <br />
                        <span className="text-blue-600">ĐIỆN ẢNH.</span>
                    </h1>

                    <p className="mb-10 max-w-xl text-lg font-light leading-relaxed text-gray-300 md:text-xl">
                        Hệ thống quản lý và đặt vé chuyên nghiệp. Khám phá những bộ phim bom tấn
                        với chất lượng hình ảnh và âm thanh đỉnh cao ngay hôm nay.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link to="/movies">
                            <Button size="lg" className="h-14 px-10 text-lg font-bold transition-transform hover:scale-105">
                                <Play size={20} className="mr-2 fill-current" />
                                Xem ngay
                            </Button>
                        </Link>
                        <Link to="/cinemas">
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 border-white/40 px-10 text-lg font-bold transition-all hover:bg-white hover:text-black"
                            >
                                <Info size={20} className="mr-2" />
                                Thông tin rạp
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content Section: Movie Grid and Search */}
            <section className="container relative z-30 mx-auto -mt-20 px-6 md:px-12">
                <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Phim Đang Chiếu</h2>
                        <div className="h-1.5 w-16 rounded-full bg-blue-600" />
                    </div>

                    <div className="group relative w-full md:w-96">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500"
                            size={18}
                        />
                        <input
                            type="text"
                            className="h-12 w-full rounded-full border border-white/10 bg-[#141414] pl-12 pr-4 text-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                            placeholder="Tìm kiếm phim..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>

                {filteredMovies.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filteredMovies.map((movie) => (
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
                                        <Button size="sm" className="w-full font-bold shadow-lg">
                                            Chi tiết
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1">
                                    <h3 className="line-clamp-1 text-base font-bold transition-colors group-hover:text-blue-500">
                                        {movie.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} className="text-blue-500" /> {movie.durationMinutes}m
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-gray-600" />
                                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
                            🔍
                        </div>
                        <p className="text-gray-400">Không tìm thấy phim phù hợp với "{keyword}"</p>
                        <Button
                            variant="ghost"
                            className="mt-4 text-blue-500 hover:text-blue-400"
                            onClick={() => setKeyword('')}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
};