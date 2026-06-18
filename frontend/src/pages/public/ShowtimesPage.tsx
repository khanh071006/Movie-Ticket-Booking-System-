import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Ticket, MapPin, ChevronDown } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import type { Movie, Showtime, Cinema } from '../../types/app';


// Utility to get next 14 days
const getNextDays = (count: number) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        days.push(nextDate);
    }
    return days;
};

const DATES = getNextDays(14);

export const ShowtimesPage = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date>(DATES[0]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [selectedCinemaId, setSelectedCinemaId] = useState<number | 'ALL'>('ALL');
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [allCinemas, setAllCinemas] = useState<Cinema[]>([]);
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch full movies list and cinemas
    useEffect(() => {
        apiClient.movies.getAll(0, 1000).then(res => setMovies(res.content)).catch(console.error);
        apiClient.cinemas.getAll(0, 1000).then(res => setAllCinemas(res.content)).catch(console.error);
    }, []);

    // Fetch showtimes when date changes
    useEffect(() => {
        const fetchShowtimes = async () => {
            setLoading(true);
            try {
                // Format date as YYYY-MM-DD
                const dateStr = selectedDate.toLocaleDateString('en-CA'); 
                const data = await apiClient.showtimes.getByDate(dateStr);
                setShowtimes(data);
                // Reset cinema filter when changing date (City filter stays the same)
                setSelectedCinemaId('ALL');
            } catch (error) {
                console.error('Failed to fetch showtimes:', error);
                setShowtimes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchShowtimes();
    }, [selectedDate]);

    // Phân tích rạp theo Tỉnh/Thành phố từ TẤT CẢ các rạp (không phụ thuộc showtimes)
    const { cities, cinemasByCity } = useMemo(() => {
        const map = new Map<number, Cinema & { city: string }>();
        allCinemas.forEach(c => {
            const city = c.city || 'Khác';
            map.set(c.id, { ...c, city });
        });

        const uniqueCinemas = Array.from(map.values());
        const citySet = new Set<string>();
        const grouped: Record<string, typeof uniqueCinemas> = {};

        uniqueCinemas.forEach(c => {
            citySet.add(c.city);
            if (!grouped[c.city]) grouped[c.city] = [];
            grouped[c.city].push(c);
        });

        // Sắp xếp rạp trong từng thành phố theo tên
        for (const key in grouped) {
            grouped[key].sort((a, b) => a.name.localeCompare(b.name));
        }

        return {
            cities: Array.from(citySet).sort(),
            cinemasByCity: grouped
        };
    }, [allCinemas]);

    // Group showtimes by Movie -> Cinema
    const groupedData = useMemo(() => {
        if (!selectedCity) return [];

        const groups: Record<string, {
            movie: Movie;
            cinemas: Record<string, { cinemaName: string; cinemaId: number; showtimes: Showtime[] }>
        }> = {};

        showtimes.forEach(st => {
            const movieId = st.movie?.id;
            const cinema = st.room?.cinema;
            const cinemaId = cinema?.id;

            if (!movieId || !cinema || cinemaId === undefined) return;

            const city = cinema.city || 'Khác';

            // Lọc theo Khu vực
            if (selectedCity !== 'ALL' && city !== selectedCity) return;
            // Lọc theo Rạp cụ thể
            if (selectedCinemaId !== 'ALL' && cinemaId !== Number(selectedCinemaId)) return;

            const fullMovie = movies.find(m => m.id === movieId);
            if (!fullMovie) return; 

            if (!groups[movieId]) {
                groups[movieId] = { movie: fullMovie, cinemas: {} };
            }

            if (!groups[movieId].cinemas[cinemaId]) {
                groups[movieId].cinemas[cinemaId] = {
                    cinemaName: cinema.name,
                    cinemaId: cinemaId,
                    showtimes: []
                };
            }
            groups[movieId].cinemas[cinemaId].showtimes.push(st);
        });

        // Chỉ trả về các phim có suất chiếu sau khi đã lọc
        return Object.values(groups).filter(g => Object.keys(g.cinemas).length > 0);
    }, [showtimes, movies, selectedCity, selectedCinemaId]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            // Scroll exact width of one item + gap (approx 116px). For 7 items, scroll 3 items at a time
            const amount = 348; 
            scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Lịch Chiếu Phim</h1>
                <p className="mt-2 text-slate-400 font-bold tracking-wide">Chọn ngày và rạp để xem các suất chiếu mới nhất.</p>
            </div>


            {/* Filters Area */}
            <div className="flex flex-col items-center mb-12 gap-6">
                {/* City Filter Dropdown */}
                {cities.length > 0 && (
                    <div className="relative z-50 flex justify-center">
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
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[90vw] max-w-[850px] max-h-[60vh] overflow-y-auto bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-50 p-6 md:p-8 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-300 hide-scrollbar">
                                    <h3 className="text-white font-black uppercase tracking-widest text-lg mb-6 flex items-center gap-2 border-b border-white/10 pb-5">
                                        <MapPin className="text-indigo-500" /> Vui lòng chọn Tỉnh / Thành phố
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                                        {cities.map(city => (
                                            <button 
                                                key={city}
                                                onClick={() => { 
                                                    setSelectedCity(city); 
                                                    setSelectedCinemaId('ALL');
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
                )}

                {/* Cinema Filter - Only show if a specific city is selected */}
                {selectedCity && cinemasByCity[selectedCity] && (
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-4xl p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                        <button 
                            onClick={() => setSelectedCinemaId('ALL')}
                            className={`px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${selectedCinemaId === 'ALL' ? 'bg-blue-600 border-blue-400 text-white shadow-md' : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}
                        >
                            Tất Cả Rạp ({selectedCity})
                        </button>
                        {cinemasByCity[selectedCity].map(c => (
                            <button 
                                key={c.id}
                                onClick={() => setSelectedCinemaId(c.id)}
                                className={`px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${selectedCinemaId === c.id ? 'bg-blue-600 border-blue-400 text-white shadow-md' : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Premium Film Strip Date Selector - Only show if city is selected */}
                {selectedCity !== '' && (
                    <div className="flex justify-center mb-10 mt-6 w-full">
                        <div className="relative flex items-center max-w-[850px] w-full">
                            <button 
                                onClick={() => scroll('left')}
                                className="absolute -left-14 md:-left-16 z-10 h-14 w-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md"
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
                                    {DATES.map((date, index) => {
                                        const isSelected = selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth();
                                        const isToday = index === 0;
                                        const dayName = isToday ? 'Hôm nay' : date.toLocaleDateString('vi-VN', { weekday: 'short' });
                                        const dayNum = date.getDate();
                                        const monthNum = date.getMonth() + 1;

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedDate(date)}
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
                                className="absolute -right-14 md:-right-16 z-10 h-14 w-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Showtimes List */}
            <div className="space-y-8">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : selectedCity === '' ? (
                    <div className="py-20 text-center flex flex-col items-center">
                        <MapPin size={48} className="text-slate-600 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-400">Vui lòng chọn Tỉnh/Thành phố</h2>
                        <p className="text-slate-500 mt-2">Hãy chọn khu vực của bạn để xem lịch chiếu các rạp tương ứng.</p>
                    </div>
                ) : groupedData.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                        <Clock size={48} className="text-slate-600 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-400">Không có lịch chiếu nào</h2>
                        <p className="text-slate-500 mt-2">Vui lòng chọn rạp hoặc một ngày khác.</p>
                    </div>
                ) : (
                    groupedData.map((data) => (
                        <div key={data.movie.id} className="flex flex-col md:flex-row gap-6 bg-[#121212] p-4 md:p-6 rounded-2xl border border-white/5 shadow-xl hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-shadow">
                            {/* Left: Movie Poster */}
                            <div className="w-full md:w-48 shrink-0 relative rounded-xl overflow-hidden aspect-[2/3] group cursor-pointer shadow-2xl" onClick={() => navigate(`/movies/${data.movie.id}`)}>
                                <img src={data.movie.posterUrl} alt={data.movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                {data.movie.ageRestriction !== undefined && (
                                    <div className="absolute top-3 right-3">
                                        <span className={`${data.movie.ageRestriction === 0 ? 'bg-green-500' : 'bg-red-500'} px-2 py-1 rounded text-white font-black text-xs shadow-lg`}>
                                            {data.movie.ageRestriction === 0 ? 'P' : `T${data.movie.ageRestriction}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Right: Movie Info & Showtimes */}
                            <div className="flex-1 flex flex-col justify-start pt-2">
                                <div className="mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-white hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate(`/movies/${data.movie.id}`)}>
                                        {data.movie.title}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-3 text-sm text-slate-300 font-bold">
                                        {data.movie.genres && <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">{data.movie.genres.map(g => g.name).join(', ')}</span>}
                                        <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10"><Clock size={14} className="text-slate-400" /> {data.movie.durationMinutes} phút</span>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    {Object.values(data.cinemas).map((cinemaGroup) => (
                                        <div key={cinemaGroup.cinemaId} className="bg-gradient-to-r from-white/5 to-transparent rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                                            {/* Decorative indicator */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50 rounded-l-2xl"></div>
                                            
                                            <h3 className="font-black text-white text-lg tracking-wide mb-4 flex items-center gap-2">
                                                {cinemaGroup.cinemaName}
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {cinemaGroup.showtimes.map((st) => {
                                                    const time = new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                                                    return (
                                                        <button 
                                                            key={st.id}
                                                            onClick={() => navigate(`/booking/${st.id}`)}
                                                            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl font-black transition-all duration-300 border border-white/10 hover:border-blue-400 shadow-md flex items-center gap-2 group hover:-translate-y-1"
                                                        >
                                                            <Ticket size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                                                            {time}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
