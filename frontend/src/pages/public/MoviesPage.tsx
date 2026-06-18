import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Search } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import type { Movie } from '../../types/app';

type Tab = 'NOW_SHOWING' | 'COMING_SOON' | 'WATCH_AGAIN';

export const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [keyword, setKeyword] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('NOW_SHOWING');
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.movies.getAll(0, 1000).then(res => setMovies(res.content)).catch(() => setMovies([]));
    }, []);

    const filtered = useMemo(() => {
        let result = movies;

        if (activeTab === 'NOW_SHOWING') {
            result = result.filter(m => m.movieStatus?.name === 'Đang Chiếu');
        } else if (activeTab === 'COMING_SOON') {
            result = result.filter(m => m.movieStatus?.name === 'Sắp Chiếu');
        } else if (activeTab === 'WATCH_AGAIN') {
            result = result.filter(m => m.movieStatus?.name !== 'Đang Chiếu' && m.movieStatus?.name !== 'Sắp Chiếu');
        }

        const q = keyword.trim().toLowerCase();
        if (q) {
            result = result.filter((movie) => movie.title.toLowerCase().includes(q));
        }

        return result;
    }, [movies, keyword, activeTab]);

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Tất cả phim</h1>
                    <p className="mt-2 text-slate-400 font-bold tracking-wide">Khám phá toàn bộ vũ trụ điện ảnh tại đây.</p>
                </div>
                <div className="relative w-full max-w-sm">
                    <input
                        className="h-14 w-full rounded-full border border-white/10 bg-white/5 pl-14 pr-6 text-sm text-white outline-none focus:border-blue-500 focus:bg-[#1A1A1A] transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        placeholder="Tìm phim theo tên..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>
            </div>

            {/* Filter Tabs - Sleek Underline Design */}
            <div className="mb-10 w-full overflow-x-auto hide-scrollbar">
                <div className="flex items-center gap-8 md:gap-12 border-b border-white/10 px-2 min-w-max">
                    <button 
                        onClick={() => setActiveTab('NOW_SHOWING')}
                        className={`relative whitespace-nowrap pb-4 text-sm md:text-base font-black tracking-widest uppercase transition-all duration-300 ${activeTab === 'NOW_SHOWING' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Đang Chiếu
                        {activeTab === 'NOW_SHOWING' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('COMING_SOON')}
                        className={`relative whitespace-nowrap pb-4 text-sm md:text-base font-black tracking-widest uppercase transition-all duration-300 ${activeTab === 'COMING_SOON' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Sắp Chiếu
                        {activeTab === 'COMING_SOON' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('WATCH_AGAIN')}
                        className={`relative whitespace-nowrap pb-4 text-sm md:text-base font-black tracking-widest uppercase transition-all duration-300 ${activeTab === 'WATCH_AGAIN' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Xem Lại
                        {activeTab === 'WATCH_AGAIN' && (
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((movie) => (
                    <div key={movie.id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-xl hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
                        <div className="aspect-[2/3] overflow-hidden relative">
                            <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] z-10 flex items-end p-3 pb-4">
                                <div className="flex gap-2 w-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <Link 
                                        to={`/movies/${movie.id}`} 
                                        className="flex-1 bg-[#1a233a] hover:bg-[#253252] text-white font-black uppercase text-xs md:text-sm py-2.5 rounded-lg text-center transition-colors shadow-lg"
                                    >
                                        CHI TIẾT
                                    </Link>
                                    {movie.movieStatus?.name === 'Đang Chiếu' && (
                                        <Link 
                                            to={`/movies/${movie.id}/booking`} 
                                            className="flex-1 bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-black uppercase text-xs md:text-sm py-2.5 rounded-lg text-center transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                        >
                                            MUA VÉ
                                        </Link>
                                    )}
                                </div>
                            </div>
                            
                            {/* Age Restriction Badge */}
                            {movie.ageRestriction !== undefined && (
                                <div className="absolute top-3 right-3 z-20">
                                    <span className={`${movie.ageRestriction === 0 ? 'bg-green-500' : 'bg-red-500'} px-2 py-1 rounded text-white font-black text-xs shadow-lg`}>
                                        {movie.ageRestriction === 0 ? 'P' : `T${movie.ageRestriction}`}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between cursor-pointer" onClick={() => navigate(`/movies/${movie.id}`)}>
                            <div>
                                <h3 className="line-clamp-2 font-black uppercase text-white group-hover:text-blue-400 transition-colors leading-tight">{movie.title}</h3>
                                {movie.genres && movie.genres.length > 0 && (
                                    <p className="mt-1.5 text-xs text-blue-500 font-bold truncate">
                                        {movie.genres.map(g => g.name).join(', ')}
                                    </p>
                                )}
                            </div>
                            <p className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/5 w-fit px-3 py-1.5 rounded-full border border-white/5">
                                <Clock size={14} className="text-blue-400" /> {movie.durationMinutes} phút
                            </p>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search className="text-slate-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Không tìm thấy phim nào</h2>
                        <p className="text-slate-500 font-medium">Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm nhé!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
