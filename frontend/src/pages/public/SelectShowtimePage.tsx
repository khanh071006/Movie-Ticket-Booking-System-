import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Info, ArrowLeft, Clock, ChevronLeft, ChevronRight, Ticket, ChevronDown } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import type { Movie, Showtime } from '../../types/app';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Group showtimes by City -> Date -> Cinema -> Showtimes
type GroupedShowtimes = {
    [city: string]: {
        [dateStr: string]: {
            [cinemaName: string]: Showtime[];
        };
    };
};

export const SelectShowtimePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [movie, setMovie] = useState<Movie | null>(null);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedCity, setSelectedCity] = useState<string>('');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            setError('');
            try {
                const [movieData, showtimesData] = await Promise.all([
                    apiClient.movies.getById(id),
                    apiClient.showtimes.getByMovie(id)
                ]);
                setMovie(movieData);
                
                // Lọc suất chiếu tương lai
                const now = new Date();
                const movieShowtimes = showtimesData
                    .filter(st => new Date(st.startTime) > now)
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                
                setShowtimes(movieShowtimes);

                // We will handle setting selected city/date in a separate useEffect

            } catch (err) {
                setError(parseError(err));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const groupedShowtimes = useMemo(() => {
        const grouped: GroupedShowtimes = {};
        showtimes.forEach(st => {
            const city = st.room?.cinema?.city || 'Khác';
            const d = new Date(st.startTime);
            d.setHours(0, 0, 0, 0);
            const dateStr = d.toISOString();
            const cinemaName = st.room?.cinema?.name || 'Unknown Cinema';

            if (!grouped[city]) grouped[city] = {};
            if (!grouped[city][dateStr]) grouped[city][dateStr] = {};
            if (!grouped[city][dateStr][cinemaName]) grouped[city][dateStr][cinemaName] = [];
            
            grouped[city][dateStr][cinemaName].push(st);
        });
        return grouped;
    }, [showtimes]);

    const availableCities = Object.keys(groupedShowtimes).sort();
    const availableDatesInCity = selectedCity && groupedShowtimes[selectedCity] ? Object.keys(groupedShowtimes[selectedCity]).sort() : [];

    // Auto select first date when city changes and no date is selected
    useEffect(() => {
        if (selectedCity && availableDatesInCity.length > 0) {
            if (!availableDatesInCity.includes(selectedDate)) {
                setSelectedDate(availableDatesInCity[0]);
            }
        }
    }, [selectedCity, availableDatesInCity, selectedDate]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = 348; 
            scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

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
        <div className="w-full min-h-screen bg-[#0A0A0A] text-white pb-20">
            {/* Cinematic Hero Header */}
            <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden flex items-end">
                <div className="absolute inset-0 bg-black z-0">
                    {movie.posterUrl && (
                        <img 
                            src={movie.posterUrl} 
                            alt={movie.title} 
                            className="w-full h-full object-cover opacity-30 blur-md scale-105" 
                        />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10" />
                
                <div className="container mx-auto px-4 md:px-8 relative z-20 pb-10">
                    <button 
                        onClick={() => navigate(`/movies/${movie.id}`)}
                        className="mb-6 flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/5 w-fit px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg font-bold text-sm uppercase tracking-widest hover:bg-white/10"
                    >
                        <ArrowLeft size={16} /> Chi tiết phim
                    </button>
                    
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                        {movie.posterUrl && (
                            <div className="w-32 md:w-48 shrink-0 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10">
                                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 flex flex-col justify-start pt-2">
                            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest drop-shadow-lg mb-4 leading-tight">{movie.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-300">
                                {movie.genres && movie.genres.length > 0 && (
                                    <span className="text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-full border border-blue-400/20 shadow-sm">{movie.genres.map(g => g.name).join(', ')}</span>
                                )}
                                <span className="flex items-center gap-1.5 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 shadow-sm"><Clock size={14} className="text-slate-400" /> {movie.durationMinutes} Phút</span>
                                {movie.ageRestriction !== undefined && (
                                    <span className={`px-4 py-1.5 rounded-full font-black text-white shadow-lg border ${movie.ageRestriction === 0 ? 'bg-green-500/90 border-green-400' : 'bg-red-500/90 border-red-400'}`}>
                                        {movie.ageRestriction === 0 ? 'P' : `T${movie.ageRestriction}`}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 -mt-6 md:-mt-10 relative z-30">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] inline-block relative">
                        CHỌN LỊCH CHIẾU
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    </h2>
                </div>

                {availableCities.length === 0 ? (
                    <div className="text-center py-20 bg-[#121212]/50 rounded-3xl border border-white/5 max-w-2xl mx-auto backdrop-blur-md">
                        <Calendar size={64} className="mx-auto text-slate-600 mb-6" />
                        <p className="text-2xl text-slate-400 font-bold">Chưa có lịch chiếu nào cho phim này.</p>
                        <p className="text-slate-500 mt-2">Vui lòng quay lại sau hoặc chọn phim khác.</p>
                        <Button onClick={() => navigate('/movies')} className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest">XEM PHIM KHÁC</Button>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* City Filter Dropdown */}
                        <div className="flex flex-col items-center gap-4 relative z-50">
                            <button 
                                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm md:text-base tracking-widest uppercase transition-all duration-300 border bg-gradient-to-r from-[#1a1a1a] to-[#111] border-white/10 text-white hover:border-white/30 shadow-lg hover:shadow-indigo-500/20"
                            >
                                <MapPin size={20} className={selectedCity ? "text-indigo-400" : "text-slate-400"} />
                                {selectedCity ? `Khu Vực: ${selectedCity}` : 'Chọn Khu Vực'}
                                <ChevronDown size={20} className={`transition-transform duration-300 ml-2 text-slate-500 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isCityDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsCityDropdownOpen(false)}></div>
                                    <div className="absolute top-full mt-4 w-[90vw] max-w-[850px] max-h-[60vh] overflow-y-auto bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-50 p-6 md:p-8 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-300 hide-scrollbar">
                                        <h3 className="text-white font-black uppercase tracking-widest text-lg mb-6 flex items-center gap-2 border-b border-white/10 pb-5">
                                            <MapPin className="text-indigo-500" /> Vui lòng chọn Tỉnh / Thành phố
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                                            {availableCities.map(city => (
                                                <button 
                                                    key={city}
                                                    onClick={() => { 
                                                        setSelectedCity(city); 
                                                        setIsCityDropdownOpen(false);
                                                    }}
                                                    className={`px-4 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 border text-left flex items-center justify-between group ${selectedCity === city ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-[1.02]' : 'bg-white/5 border-transparent text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]'}`}
                                                >
                                                    <span className="truncate">{city}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {selectedCity === '' ? (
                            <div className="py-20 text-center flex flex-col items-center">
                                <MapPin size={48} className="text-slate-600 mb-4" />
                                <h2 className="text-2xl font-bold text-slate-400">Vui lòng chọn Tỉnh/Thành phố</h2>
                                <p className="text-slate-500 mt-2">Chọn khu vực của bạn để xem lịch chiếu.</p>
                            </div>
                        ) : (
                            <>
                                {/* Premium Film Strip Date Selector */}
                                <div className="flex justify-center">
                                    <div className="relative flex items-center max-w-[850px] w-full">
                                        <button 
                                            onClick={() => scroll('left')}
                                            className="absolute -left-4 md:-left-16 z-10 h-12 w-12 md:h-14 md:w-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md"
                                        >
                                            <ChevronLeft size={28} />
                                        </button>

                                        {/* Film strip container */}
                                        <div className="w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#111] border border-white/5 shadow-2xl relative p-1">
                                            {/* Film sprocket holes top */}
                                            <div className="absolute top-2 left-0 w-full flex justify-between px-4 opacity-30">
                                                {Array.from({length: 30}).map((_, i) => (
                                                    <div key={`top-${i}`} className="w-3 h-2 bg-black rounded-sm shadow-[inset_0_1px_3px_rgba(0,0,0,1)]"></div>
                                                ))}
                                            </div>

                                            {/* Dates Wrapper */}
                                            <div 
                                                ref={scrollRef}
                                                className="flex items-center gap-4 px-6 py-8 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory"
                                            >
                                                {availableDatesInCity.map((dateStr, index) => {
                                                    const d = new Date(dateStr);
                                                    const isSelected = selectedDate === dateStr;
                                                    const today = new Date();
                                                    today.setHours(0,0,0,0);
                                                    const isToday = d.getTime() === today.getTime();
                                                    const dayName = isToday ? 'Hôm nay' : d.toLocaleDateString('vi-VN', { weekday: 'short' });
                                                    const dayNum = d.getDate();
                                                    const monthNum = d.getMonth() + 1;

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedDate(dateStr)}
                                                            className={`relative flex flex-col items-center justify-center min-w-[100px] h-[110px] rounded-xl transition-all duration-300 shrink-0 snap-center ${
                                                                isSelected 
                                                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-[1.08] shadow-[0_0_25px_rgba(37,99,235,0.5)] z-10 border border-white/30' 
                                                                    : 'bg-[#1a1a1a] text-slate-400 hover:bg-[#252525] hover:text-white border border-white/5 hover:border-white/10 shadow-lg'
                                                            }`}
                                                        >
                                                            <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{dayName}</span>
                                                            <span className="text-3xl font-black">{dayNum}</span>
                                                            <span className={`text-xs font-bold mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-600'}`}>Tháng {monthNum}</span>
                                                            
                                                            {/* Glow effect on active */}
                                                            {isSelected && (
                                                                <div className="absolute inset-0 rounded-xl ring-2 ring-blue-400/50 ring-offset-2 ring-offset-[#0a0a0a]"></div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Film sprocket holes bottom */}
                                            <div className="absolute bottom-2 left-0 w-full flex justify-between px-4 opacity-30">
                                                {Array.from({length: 30}).map((_, i) => (
                                                    <div key={`bot-${i}`} className="w-3 h-2 bg-black rounded-sm shadow-[inset_0_1px_3px_rgba(0,0,0,1)]"></div>
                                                ))}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => scroll('right')}
                                            className="absolute -right-4 md:-right-16 z-10 h-12 w-12 md:h-14 md:w-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md"
                                        >
                                            <ChevronRight size={28} />
                                        </button>
                                    </div>
                                </div>

                                {/* Showtimes by Cinema */}
                                <div className="max-w-4xl mx-auto space-y-8">
                                    {!selectedDate || !groupedShowtimes[selectedCity][selectedDate] ? (
                                        <p className="text-center py-10 text-slate-500 font-medium bg-[#121212]/50 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">Không có suất chiếu nào trong ngày này.</p>
                                    ) : (
                                        Object.entries(groupedShowtimes[selectedCity][selectedDate]).map(([cinemaName, stList]) => (
                                            <div key={cinemaName} className="bg-gradient-to-br from-[#151515] to-[#0A0A0A] border border-white/5 p-6 md:p-8 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                                {/* Decorative background glow */}
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>
                                                
                                                <div className="flex items-center gap-4 mb-8 relative z-10 border-b border-white/5 pb-5">
                                                    <div className="w-12 h-12 rounded-full bg-blue-900/30 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                                                        <MapPin size={24} />
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">{cinemaName}</h3>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-4 relative z-10">
                                                    {stList.map(st => {
                                                        const time = new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                                                        return (
                                                            <button
                                                                key={st.id}
                                                                onClick={() => navigate(`/booking/${st.id}`)}
                                                                className="group/btn relative bg-[#1A1A1A] hover:bg-blue-600 border border-white/10 hover:border-blue-400 rounded-2xl px-6 py-4 transition-all duration-300 shadow-lg flex flex-col items-center min-w-[120px] overflow-hidden"
                                                            >
                                                                {/* Subtle shine effect */}
                                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                                
                                                                <div className="flex items-center justify-center gap-2 mb-1.5">
                                                                    <Ticket size={16} className="text-slate-500 group-hover/btn:text-blue-200 transition-colors" />
                                                                    <span className="text-2xl font-black text-white group-hover/btn:text-white drop-shadow-md">{time}</span>
                                                                </div>
                                                                <span className="text-[10px] uppercase tracking-widest text-slate-500 group-hover/btn:text-blue-100 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5 group-hover/btn:border-blue-400/30">
                                                                    {st.room?.name || 'Rạp'}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
