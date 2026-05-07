import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Play, TrendingUp } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import type { Movie } from '../../types/app';
import { Button } from '../../components/ui/Button';

export const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        apiClient.movies.getAll().then(setMovies).catch(() => setMovies([]));
    }, []);

    const filteredMovies = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return movies;
        return movies.filter((movie) => movie.title.toLowerCase().includes(q) || movie.description.toLowerCase().includes(q));
    }, [movies, keyword]);

    return (
        <div className="space-y-16 pb-16">
            <section className="relative flex h-[80vh] min-h-[560px] w-full items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2025"
                    className="absolute inset-0 h-full w-full scale-105 object-cover opacity-60"
                    alt="Hero"
                />
                <div className="relative z-20 container mx-auto mt-20 px-4">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-md">
                        <TrendingUp className="h-4 w-4" />
                        <span>Trải nghiệm điện ảnh cao cấp</span>
                    </div>
                    <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
                        Thưởng thức điện ảnh <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">đỉnh cao</span>
                    </h1>
                    <p className="mb-10 mt-6 max-w-2xl text-lg font-light text-slate-300 md:text-xl">
                        Xem thông tin phim, lịch chiếu theo rạp và quản lý toàn bộ dữ liệu rạp phim trên cùng một hệ thống.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button size="lg" className="h-12 rounded-full border-0 bg-blue-600 px-8 text-base font-semibold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-500">
                                Đăng nhập để quản trị
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12 rounded-full border-white/20 px-8 text-base font-semibold text-white">
                            <Play className="mr-2 h-4 w-4" />
                            Xem trailer
                        </Button>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4">
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Phim đang chiếu</h2>
                        <p className="font-light text-slate-400">Khám phá các bộ phim nổi bật đang có lịch chiếu.</p>
                    </div>
                    <input
                        className="h-10 w-full max-w-sm rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white outline-none focus:border-blue-400"
                        placeholder="Tìm phim theo tên hoặc mô tả..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                    {filteredMovies.map((movie) => (
                        <Link key={movie.id} to={`/movies/${movie.id}`} className="group relative flex h-full flex-col rounded-2xl focus:outline-none">
                            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">
                                {movie.posterUrl ? (
                                    <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-700">Chưa có ảnh</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="absolute right-3 top-3 rounded-md border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                                    {movie.language || 'N/A'}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col px-1 pt-4">
                                <h3 className="line-clamp-1 text-lg font-bold leading-tight transition-colors group-hover:text-blue-400">{movie.title}</h3>
                                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" /> {movie.durationMinutes}m
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-slate-600" />
                                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};
