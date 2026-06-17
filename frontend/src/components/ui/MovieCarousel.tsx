import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/app';


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';

interface MovieCarouselProps {
    title: string;
    movies: Movie[];
}

export const MovieCarousel = ({ title, movies }: MovieCarouselProps) => {
    if (movies.length === 0) return null;

    // Tự động clone phim nếu danh sách ít hơn 5 phim để loop mượt
    const displayMovies = movies.length < 5 ? [...movies, ...movies, ...movies] : movies;

    return (
        <div className="w-full py-6">
            {/* Title */}
            <div className="mb-6">
                <div className="inline-block relative">
                    <h2 className="text-3xl md:text-4xl font-black tracking-widest uppercase italic text-white drop-shadow-md relative z-10 bg-[#0A0A0A] pr-4">
                        {title}
                    </h2>
                    {/* Gạch chân trang trí giống bản vẽ */}
                    <div className="absolute -bottom-2 left-0 h-1.5 w-1/2 bg-blue-600 rounded-r-full" />
                </div>
            </div>

            {/* Slider */}
            <div className="relative group">
                <Swiper
                    grabCursor={true}
                    slidesPerView={2}
                    spaceBetween={16}
                    breakpoints={{
                        640: { slidesPerView: 3, spaceBetween: 20 },
                        768: { slidesPerView: 4, spaceBetween: 24 },
                        1024: { slidesPerView: 5, spaceBetween: 24 },
                        1280: { slidesPerView: 5, spaceBetween: 30 },
                    }}
                    loop={true}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    navigation={true}
                    modules={[Navigation, Autoplay]}
                    className="movie-swiper-flat !py-4"
                >
                    {displayMovies.map((movie, index) => (
                        <SwiperSlide key={`${movie.id}-${index}`} className="group/slide">
                            <div
                                className="flex flex-col h-full transition-all duration-300"
                            >
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/5 shadow-lg bg-[#1A1A1A]">
                                    <Link to={`/movies/${movie.id}`} className="block w-full h-full">
                                        {movie.posterUrl ? (
                                            <img 
                                                src={movie.posterUrl} 
                                                alt={movie.title} 
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover/slide:scale-110" 
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-600">
                                                No Poster
                                            </div>
                                        )}
                                    </Link>
                                    
                                    {/* Tags */}
                                    <div className="absolute left-3 top-3 flex flex-col gap-2 pointer-events-none">
                                        <span className="rounded bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/10 shadow-lg">
                                            {movie.language?.split(' ')[0] || '2D'}
                                        </span>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] z-10 flex items-end p-3 pb-4 pointer-events-none">
                                        <div className="flex gap-2 w-full transform translate-y-4 group-hover/slide:translate-y-0 transition-all duration-300 pointer-events-auto">
                                            <Link 
                                                to={`/movies/${movie.id}`} 
                                                className="flex-1 bg-[#1a233a] hover:bg-[#253252] text-white font-black uppercase text-xs py-2.5 rounded-lg text-center transition-colors shadow-lg flex items-center justify-center h-10"
                                            >
                                                CHI TIẾT
                                            </Link>
                                            {movie.movieStatus?.name === 'Đang Chiếu' && (
                                                <Link 
                                                    to={`/movies/${movie.id}/booking`} 
                                                    className="flex-1 bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-black uppercase text-xs py-2.5 rounded-lg text-center transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center h-10"
                                                >
                                                    MUA VÉ
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Text information below the slide */}
                                <Link to={`/movies/${movie.id}`} className="mt-4 space-y-1 px-1 block group/text">
                                    <h3 className="line-clamp-1 text-base font-bold uppercase leading-tight text-slate-200 transition-colors group-hover/slide:text-blue-500 group-hover/text:text-blue-500">
                                        {movie.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {movie.durationMinutes}m
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                    </div>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};
