import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Globe, MapPin, Play, Ticket, ChevronRight, Info, Star, ArrowLeft } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Cinema, Movie, Showtime } from '../../types/app';

export const MovieDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [allShowtimes, setAllShowtimes] = useState<Showtime[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        
        const fetchData = async () => {
            try {
                const [movieData, cinemasData] = await Promise.all([
                    apiClient.movies.getById(id),
                    apiClient.cinemas.getAll()
                ]);
                
                setMovie(movieData);
                setCinemas(cinemasData);

                // Fetch all showtimes for this movie
                const showtimesByMovie = await apiClient.showtimes.getByMovie(id);
                setAllShowtimes(showtimesByMovie);

                // Initialize selected date to today or the first available date
                const uniqueDates = [...new Set(showtimesByMovie.map(st => 
                    new Date(st.startTime).toISOString().split('T')[0]
                ))].sort();
                
                if (uniqueDates.length > 0) {
                    const today = new Date().toISOString().split('T')[0];
                    setSelectedDate(uniqueDates.includes(today) ? today : uniqueDates[0]);
                }
            } catch (err) {
                console.error('Failed to fetch movie detail:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    const formatFullDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
    };

    const formatTime = (value: string) => 
        new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Group dates for the date selector
    const availableDates = useMemo(() => {
        const dates = [...new Set(allShowtimes.map(st => 
            new Date(st.startTime).toISOString().split('T')[0]
        ))].sort();
        return dates;
    }, [allShowtimes]);

    // Filter showtimes based on selected date and group by cinema
    const filteredShowtimesByCinema = useMemo(() => {
        if (!selectedDate) return {};
        
        const filtered = allShowtimes.filter(st => 
            new Date(st.startTime).toISOString().split('T')[0] === selectedDate
        );

        const grouped: Record<string, Showtime[]> = {};
        filtered.forEach(st => {
            const cinemaId = st.room?.cinema?.id || 'unknown';
            if (!grouped[cinemaId]) grouped[cinemaId] = [];
            grouped[cinemaId].push(st);
        });
        
        return grouped;
    }, [allShowtimes, selectedDate]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] text-slate-400">
                <Info size={48} className="mb-4 text-slate-700" />
                <p className="text-xl font-medium">Không tìm thấy thông tin phim.</p>
                <Button variant="ghost" className="mt-4 text-blue-500" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-blue-600/30">
            {/* Hero Banner Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                {/* Background Poster with Blur */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={movie.posterUrl} 
                        alt="" 
                        className="h-full w-full object-cover scale-110 blur-2xl opacity-40" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto flex h-full flex-col px-4 pb-12 lg:px-8">
                    {/* Top Navigation */}
                    <div className="pt-24 pb-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/10"
                        >
                            <ArrowLeft size={16} />
                            Quay lại
                        </Button>
                    </div>
                    
                    <div className="mt-auto flex flex-col gap-8 md:flex-row md:items-end">
                        {/* Main Poster */}
                        <div className="relative hidden w-64 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50 md:block lg:w-80">
                            <img 
                                src={movie.posterUrl} 
                                alt={movie.title} 
                                className="aspect-[2/3] w-full object-cover" 
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                        </div>

                        {/* Movie Content Meta */}
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-900/40">
                                    Đang chiếu
                                </span>
                                <span className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400 backdrop-blur-md">
                                    <Star size={12} className="fill-current" /> 8.5 IMDB
                                </span>
                            </div>

                            <h1 className="text-4xl font-black leading-none tracking-tighter text-white drop-shadow-2xl md:text-6xl lg:text-7xl italic uppercase">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-widest text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500" /> {movie.durationMinutes} phút
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500" /> {formatDate(movie.releaseDate)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-blue-500" /> {movie.language}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <Button size="lg" className="h-14 rounded-xl bg-blue-600 px-10 text-lg font-black italic shadow-2xl shadow-blue-900/40 transition-transform active:scale-95">
                                    <Ticket className="mr-3 h-6 w-6" />
                                    ĐẶT VÉ NGAY
                                </Button>
                                <a href={movie.trailerUrl} target="_blank" rel="noreferrer">
                                    <Button size="lg" variant="outline" className="h-14 rounded-xl border-white/20 bg-white/5 px-10 text-lg font-black italic backdrop-blur-md transition-all hover:bg-white hover:text-black">
                                        <Play className="mr-3 h-6 w-6 fill-current" />
                                        TRAILER
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Body */}
            <div className="container mx-auto px-4 py-16 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-12">
                    {/* Left Column: Content & Showtimes */}
                    <div className="space-y-16 lg:col-span-8">
                        {/* Description */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1.5 rounded-full bg-blue-600" />
                                <h2 className="text-2xl font-black tracking-tight uppercase italic">Nội dung <span className="text-blue-600">Phim</span></h2>
                            </div>
                            <p className="text-lg font-medium leading-relaxed text-slate-400">
                                {movie.description}
                            </p>
                        </div>

                        {/* Showtimes Section */}
                        <div className="space-y-8">
                            <div className="flex flex-col justify-between gap-6 border-b border-white/5 pb-8 md:flex-row md:items-end">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-1.5 rounded-full bg-blue-600" />
                                        <h2 className="text-2xl font-black tracking-tight uppercase italic">Lịch <span className="text-blue-600">Chiếu</span></h2>
                                    </div>
                                    <p className="text-sm text-slate-500">Vui lòng chọn ngày để xem các suất chiếu khả dụng.</p>
                                </div>

                                {/* Date Selector */}
                                <div className="flex flex-wrap gap-3">
                                    {availableDates.length > 0 ? availableDates.map((date) => (
                                        <button
                                            key={date}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex flex-col items-center rounded-2xl border px-5 py-3 transition-all ${
                                                selectedDate === date
                                                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                                                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10'
                                            }`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                                {new Date(date).toLocaleDateString('vi-VN', { month: 'short' })}
                                            </span>
                                            <span className="text-xl font-black">{new Date(date).getDate()}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                                                {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                                            </span>
                                        </button>
                                    )) : (
                                        <div className="text-sm italic text-slate-500">Chưa có lịch chiếu được cập nhật.</div>
                                    )}
                                </div>
                            </div>

                            {/* Showtimes Grouped by Cinema */}
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {cinemas.map((cinema) => {
                                    const cinemaShowtimes = filteredShowtimesByCinema[cinema.id] || [];
                                    if (!cinemaShowtimes.length) return null;

                                    return (
                                        <div key={cinema.id} className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/30 transition-all hover:border-white/10">
                                            <div className="flex flex-col justify-between gap-4 border-b border-white/5 bg-white/[0.02] p-6 md:flex-row md:items-center">
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400">{cinema.name}</h3>
                                                    <p className="flex items-center gap-2 text-sm text-slate-500">
                                                        <MapPin size={14} className="text-blue-600" />
                                                        {cinema.address}
                                                    </p>
                                                </div>
                                                <div className="hidden h-12 w-px bg-white/5 md:block" />
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ngày đang chọn</p>
                                                        <p className="text-sm font-bold text-blue-500">{formatFullDate(selectedDate)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                                    {cinemaShowtimes.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((st) => (
                                                        <button 
                                                            key={st.id} 
                                                            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 py-4 transition-all hover:border-blue-500 hover:bg-blue-600 active:scale-95"
                                                        >
                                                            <span className="text-2xl font-black text-white">{formatTime(st.startTime)}</span>
                                                            <span className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-100">
                                                                {st.room?.name || 'SCREEN 01'}
                                                            </span>
                                                            <div className="absolute inset-0 bg-blue-400/10 opacity-0 transition-opacity group-hover:opacity-100" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {selectedDate && Object.keys(filteredShowtimesByCinema).length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="mb-4 rounded-full bg-white/5 p-4 text-slate-700">
                                            <Ticket size={48} />
                                        </div>
                                        <p className="text-lg font-bold text-slate-500">Rất tiếc, ngày {formatDate(selectedDate)} chưa có suất chiếu nào.</p>
                                        <p className="text-sm text-slate-600">Vui lòng chọn một ngày khác.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Info */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 space-y-8">
                            <Card className="overflow-hidden border-white/10 bg-zinc-900/50 backdrop-blur-md">
                                <div className="flex items-center gap-3 border-b border-white/5 bg-white/5 px-6 py-4">
                                    <Info size={18} className="text-blue-500" />
                                    <h3 className="font-black italic uppercase text-white">Chi tiết <span className="text-blue-600">Phim</span></h3>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Ngôn ngữ</p>
                                        <p className="text-base font-bold text-slate-200">{movie.language}</p>
                                    </div>
                                    <div className="h-px w-full bg-white/5" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Thời lượng</p>
                                        <p className="text-base font-bold text-slate-200">{movie.durationMinutes} phút</p>
                                    </div>
                                    <div className="h-px w-full bg-white/5" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Khởi chiếu</p>
                                        <p className="text-base font-bold text-slate-200">{formatDate(movie.releaseDate)}</p>
                                    </div>
                                    <div className="h-px w-full bg-white/5" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Định dạng</p>
                                        <p className="text-base font-bold text-slate-200">2D, 3D, IMAX</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Booking Policy/Ad */}
                            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-900 p-8 shadow-2xl shadow-blue-900/20">
                                <div className="relative z-10 space-y-4">
                                    <h4 className="text-2xl font-black italic text-white uppercase leading-tight">Ưu đãi <br />Thành viên</h4>
                                    <p className="text-sm font-medium text-blue-100">
                                        Giảm ngay 20% cho mỗi lượt đặt vé trực tuyến và tích điểm đổi quà.
                                    </p>
                                    <Button className="w-full bg-white text-blue-900 font-black italic hover:bg-slate-100">
                                        ĐĂNG KÝ NGAY
                                    </Button>
                                </div>
                                <Star className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 rotate-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
