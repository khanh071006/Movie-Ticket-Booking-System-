import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Ticket, Info, ArrowLeft } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import type { Movie } from '../../types/app';
import { Button } from '../../components/ui/Button';

export const MovieDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadMovieData = async () => {
            if (!id) return;
            setLoading(true);
            setError('');
            try {
                const movieData = await apiClient.movies.getById(id);
                setMovie(movieData);
            } catch (err) {
                setError(parseError(err));
            } finally {
                setLoading(false);
            }
        };

        loadMovieData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-[#0A0A0A]">
                <Info size={64} className="text-slate-600 mb-6" />
                <p className="text-red-400 font-bold mb-6 text-xl">{error || 'Không tìm thấy phim'}</p>
                <Button onClick={() => navigate('/movies')} className="bg-white/10 hover:bg-white/20 text-white">Quay lại danh sách</Button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#0A0A0A] text-white">
            {/* Cinematic Hero Background with Blur */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xl opacity-30 scale-110"
                    style={{ backgroundImage: `url(${movie.posterUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-8 -mt-[30vh] md:-mt-[40vh] relative z-10 pb-20">
                <button 
                    onClick={() => navigate('/movies')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 font-bold text-sm bg-black/50 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
                >
                    <ArrowLeft size={16} /> QUAY LẠI
                </button>

                {/* Title Section */}
                <div className="w-full mb-10 border-b border-white/10 pb-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-widest drop-shadow-[0_0_15px_rgba(37,99,235,0.3)] leading-tight">
                        {movie.title}
                    </h1>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                        {/* Left: Poster */}
                        <div className="w-full max-w-[300px] lg:w-1/3 xl:w-1/4 mx-auto lg:mx-0 shrink-0 relative group">
                            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative aspect-[2/3] w-full">
                                <img 
                                    src={movie.posterUrl} 
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Play Trailer Overlay */}
                                {movie.trailerUrl && (
                                    <a 
                                        href={movie.trailerUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                            <Play size={24} className="text-white ml-1" />
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Right: Details Box & Action */}
                        <div className="flex-1 w-full flex flex-col gap-8">
                            <div className="w-full bg-[#121212]/80 border border-white/5 p-6 md:p-10 rounded-3xl backdrop-blur-xl shadow-2xl space-y-5">
                                {movie.director?.name && (
                                    <div className="border-b border-white/5 pb-4 flex items-baseline gap-4">
                                        <span className="font-bold text-slate-500 uppercase tracking-widest text-xs shrink-0 w-28">Đạo diễn</span> 
                                        <span className="font-bold text-slate-200 text-lg md:text-xl">{movie.director.name}</span>
                                    </div>
                                )}
                                
                                {movie.castMembers && movie.castMembers.length > 0 && (
                                    <div className="border-b border-white/5 pb-4 flex items-baseline gap-4">
                                        <span className="font-bold text-slate-500 uppercase tracking-widest text-xs shrink-0 w-28">Diễn viên</span> 
                                        <span className="font-medium text-slate-300 text-lg md:text-xl leading-relaxed">{movie.castMembers.map(c => c.name).join(', ')}</span>
                                    </div>
                                )}

                                {movie.genres && movie.genres.length > 0 && (
                                    <div className="border-b border-white/5 pb-4 flex items-baseline gap-4">
                                        <span className="font-bold text-slate-500 uppercase tracking-widest text-xs shrink-0 w-28">Thể loại</span> 
                                        <span className="font-black text-blue-400 text-lg md:text-xl">{movie.genres.map(g => g.name).join(', ')}</span>
                                    </div>
                                )}

                                {movie.releaseDate && (
                                    <div className="border-b border-white/5 pb-4 flex items-baseline gap-4">
                                        <span className="font-bold text-slate-500 uppercase tracking-widest text-xs shrink-0 w-28">Khởi chiếu</span> 
                                        <span className="font-bold text-slate-200 text-lg md:text-xl">{new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                )}

                                {movie.durationMinutes > 0 && (
                                    <div className="border-b border-white/5 pb-4 flex items-baseline gap-4">
                                        <span className="font-bold text-slate-500 uppercase tracking-widest text-xs shrink-0 w-28">Thời lượng</span> 
                                        <span className="font-bold text-slate-200 text-lg md:text-xl">{movie.durationMinutes} phút</span>
                                    </div>
                                )}

                                {movie.language && (
                                    <div className="border-b border-white/5 pb-4 flex items-baseline gap-4">
                                        <span className="font-bold text-slate-500 uppercase tracking-widest text-xs shrink-0 w-28">Ngôn ngữ</span> 
                                        <span className="font-bold text-slate-200 text-lg md:text-xl">{movie.language}</span>
                                    </div>
                                )}

                                {movie.ageRestriction !== undefined && (
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-slate-500 uppercase tracking-widest text-xs shrink-0 w-28">Đánh giá</span> 
                                        <div className={`flex items-center gap-3 border px-4 py-2 rounded-xl ${movie.ageRestriction === 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                            <span className={`${movie.ageRestriction === 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} px-2 py-1 rounded text-white font-black text-sm`}>
                                                {movie.ageRestriction === 0 ? 'P' : `T${movie.ageRestriction}`}
                                            </span>
                                            <span className={`font-bold text-sm ${movie.ageRestriction === 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {movie.ageRestriction === 0 ? 'Phim phổ biến cho mọi lứa tuổi' : `Phim dành cho khán giả từ ${movie.ageRestriction} tuổi trở lên`}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Centered Button for the entire page */}
                    <div className="w-full flex justify-center mt-6">
                        <Button 
                            onClick={() => navigate(`/movies/${movie.id}/booking`)}
                            className="w-full sm:w-auto min-w-[320px] bg-blue-600 hover:bg-blue-500 text-white font-black text-xl py-6 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-blue-400/50"
                        >
                            <Ticket size={24} /> ĐẶT VÉ NGAY
                        </Button>
                    </div>
                </div>

                {/* Sleek Divider */}
                <div className="mt-20 mb-12 flex items-center gap-6 opacity-80">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                    <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest border border-white/10 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md">
                        <Info size={16} className="text-blue-500" /> TÓM TẮT NỘI DUNG
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                </div>

                {/* Description Text */}
                <div className="max-w-4xl mx-auto bg-[#121212]/50 p-8 md:p-10 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl">
                    <p className="text-slate-300 text-lg leading-loose text-justify">
                        {movie.description || 'Chưa có thông tin mô tả chi tiết cho bộ phim này.'}
                    </p>
                </div>
            </div>
        </div>
    );
};
