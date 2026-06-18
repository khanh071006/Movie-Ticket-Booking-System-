import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../../api/axiosClient';
import type { Movie } from '../../types/app';
import { MovieCarousel } from '../../components/ui/MovieCarousel';

export const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);


    useEffect(() => {
        // Fetch all movies on component mount
        apiClient.movies.getAll(0, 20)
            .then(res => {
                setMovies(res.content);
            })
            .catch((err) => {
                console.error('Failed to fetch movies:', err);
                setMovies([]);
            });
    }, []);

    // Phân loại phim
    const nowShowing = useMemo(() => movies.filter(m => m.movieStatus?.name === 'Đang Chiếu'), [movies]);
    const upcoming = useMemo(() => movies.filter(m => m.movieStatus?.name === 'Sắp Chiếu'), [movies]);
    
    // Giả lập danh sách phim xem lại (lấy 6 phim ngẫu nhiên hoặc các phim cũ)
    const rewatch = useMemo(() => {
        const others = movies.filter(m => m.movieStatus?.name !== 'Đang Chiếu' && m.movieStatus?.name !== 'Sắp Chiếu');
        if (others.length > 0) return others;
        // Nếu không có phim cũ, lấy vài phim đang chiếu để làm data demo
        return movies.slice(0, 6);
    }, [movies]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] pb-20 text-white">
            {/* Hero Section: High-impact cinematic entrance */}
            <section className="relative flex h-[85vh] w-full items-center overflow-hidden">
                {/* Gradient Overlays for readability and depth */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

                <img
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2025"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10000ms] hover:scale-110"
                    alt="Cinema Backdrop"
                />

                <div className="container relative z-20 mx-auto px-6 md:px-12 mt-20">
                    <h1 className="mb-6 max-w-3xl text-6xl font-black leading-none tracking-tighter md:text-8xl drop-shadow-2xl">
                        KIỆT TÁC <br />
                        <span className="text-blue-500">ĐIỆN ẢNH.</span>
                    </h1>

                    <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl drop-shadow-md">
                        Hệ thống quản lý và đặt vé chuyên nghiệp. Khám phá những bộ phim bom tấn
                        với chất lượng hình ảnh và âm thanh đỉnh cao ngay hôm nay.
                    </p>
                </div>
            </section>

            {/* Content Section: Movie Carousels */}
            <section className="container relative z-30 mx-auto -mt-32 px-6 md:px-12 space-y-16">
                
                {movies.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
                            🎬
                        </div>
                        <p className="text-gray-400">Hệ thống đang cập nhật phim mới...</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {nowShowing.length > 0 && <MovieCarousel title="Phim Đang Chiếu" movies={nowShowing} />}
                        {upcoming.length > 0 && <MovieCarousel title="Phim Sắp Chiếu" movies={upcoming} />}
                        {rewatch.length > 0 && <MovieCarousel title="Xem Lại / Phim Bộ" movies={rewatch} />}
                    </div>
                )}
            </section>
        </div>
    );
};