import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, Clock, MapPin, MonitorPlay, Coffee, Armchair, Info } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { Seat, TicketType, Showtime, BookingResponse, Snack, CinemaPricing } from '../../types/app';

const indexToLetter = (index: number) => String.fromCharCode(65 + index);
const letterToIndex = (letter: string) => letter.charCodeAt(0) - 65;

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

export const BookingPage = () => {
    const { showtimeId } = useParams<{ showtimeId: string }>();
    const navigate = useNavigate();

    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [snacks, setSnacks] = useState<Snack[]>([]);
    
    // Grid setup
    const [grid, setGrid] = useState<(Seat | null)[][]>([]);

    // User Selection
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [ticketQuantities, setTicketQuantities] = useState<Record<number, number>>({});
    const [snackQuantities, setSnackQuantities] = useState<Record<number, number>>({});
    
    // Status
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState<BookingResponse | null>(null);
    const [pricing, setPricing] = useState<CinemaPricing | null>(null);

    const loadData = useCallback(async () => {
        if (!showtimeId) return;
        setLoading(true);
        setError('');
        try {
            const st = await apiClient.showtimes.getById(showtimeId);
            setShowtime(st);

            const roomId = st.room?.id;
            const cinemaId = st.room?.cinema?.id;
            if (!roomId) throw new Error("Suất chiếu không có phòng chiếu");

            const [roomSeats, types, snacksData, pricingRes] = await Promise.all([
                apiClient.rooms.getSeats(roomId),
                apiClient.ticketTypes.getAll(),
                apiClient.snacks.getAll(),
                cinemaId ? apiClient.cinemas.getPricing(cinemaId).catch(() => null) : Promise.resolve(null)
            ]);
            
            setTicketTypes(types);
            setSnacks(snacksData);
            if (pricingRes) setPricing(pricingRes);

            // Init ticket quantities to 0
            const initialTicketQuantities: Record<number, number> = {};
            types.forEach(t => { initialTicketQuantities[t.id] = 0; });
            setTicketQuantities(initialTicketQuantities);

            // Init snack quantities to 0
            const initialSnackQuantities: Record<number, number> = {};
            snacksData.forEach(s => { initialSnackQuantities[s.id] = 0; });
            setSnackQuantities(initialSnackQuantities);

            // Reconstruct grid
            if (roomSeats.length > 0) {
                let maxR = 0;
                let maxC = 0;
                
                roomSeats.forEach(seat => {
                    const match = seat.seatLocation.match(/^([A-Z]+)(\d+)$/);
                    if (match) {
                        const r = letterToIndex(match[1]);
                        const c = parseInt(match[2], 10) - 1;
                        if (r > maxR) maxR = r;
                        if (c > maxC) maxC = c;
                    }
                });
                
                const newRows = maxR + 1;
                const newCols = maxC + 1;
                
                const newGrid: (Seat | null)[][] = Array(newRows).fill(null).map(() => Array(newCols).fill(null));
                roomSeats.forEach(seat => {
                    const match = seat.seatLocation.match(/^([A-Z]+)(\d+)$/);
                    if (match) {
                        const r = letterToIndex(match[1]);
                        const c = parseInt(match[2], 10) - 1;
                        newGrid[r][c] = seat;
                    }
                });
                setGrid(newGrid);
            }
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    }, [showtimeId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSeatClick = (seat: Seat) => {
        if (!seat.id) return;
        setSelectedSeats(prev => {
            const isSelected = prev.find(s => s.id === seat.id);
            if (isSelected) {
                return prev.filter(s => s.id !== seat.id);
            } else {
                return [...prev, seat];
            }
        });
    };

    const handleTicketChange = (typeId: number, delta: number) => {
        setTicketQuantities(prev => {
            const current = prev[typeId] || 0;
            const newVal = current + delta;
            if (newVal < 0) return prev;
            return { ...prev, [typeId]: newVal };
        });
    };

    const handleSnackChange = (snackId: number, delta: number) => {
        setSnackQuantities(prev => {
            const current = prev[snackId] || 0;
            const newVal = current + delta;
            if (newVal < 0) return prev;
            return { ...prev, [snackId]: newVal };
        });
    };

    const handleCheckout = async () => {
        if (!showtimeId) return;
        
        const totalTickets = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);
        const totalSelectedSeatCount = selectedSeats.reduce((sum, s) => sum + (s.seatCount || 1), 0);
        if (totalTickets !== totalSelectedSeatCount) {
            setError(`Vui lòng chọn đúng ${totalSelectedSeatCount} vé cho ${selectedSeats.length} vị trí ghế!`);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const ticketRequest = Object.entries(ticketQuantities)
                .filter(([_, qty]) => qty > 0)
                .map(([typeId, qty]) => ({
                    ticketTypeId: Number(typeId),
                    quantity: qty
                }));

            const snackRequest = Object.entries(snackQuantities)
                .filter(([_, qty]) => qty > 0)
                .map(([snackId, qty]) => ({
                    snackId: Number(snackId),
                    quantity: qty
                }));

            const response = await apiClient.bookings.create({
                showtimeId,
                seatIds: selectedSeats.map(s => s.id as number),
                ticketQuantities: ticketRequest,
                snackQuantities: snackRequest.length > 0 ? snackRequest : undefined
            });
            
            setBookingSuccess(response);
        } catch (err) {
            setError(parseError(err));
            // Cuộn lên báo lỗi
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !showtime) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            </div>
        );
    }

    if (!showtime) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <Info size={64} className="text-slate-600 mb-6" />
                <p className="text-red-400 font-bold mb-6 text-xl">{error || 'Không tìm thấy suất chiếu'}</p>
                <Button onClick={() => navigate('/movies')} className="bg-white/10 hover:bg-white/20 text-white">Quay lại danh sách phim</Button>
            </div>
        );
    }

    if (bookingSuccess) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-20 mb-32 animate-in zoom-in duration-500">
                <Card className="border-white/10 bg-zinc-900/80 p-10 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2 italic uppercase drop-shadow-md">ĐẶT VÉ THÀNH CÔNG!</h1>
                        <p className="text-slate-400 mb-8 font-medium">Mã giao dịch của bạn là: <span className="font-mono text-emerald-400 font-black text-lg bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">#{bookingSuccess.id.split('-')[0].toUpperCase()}</span></p>
                        
                        <div className="bg-[#0A0A0A]/50 rounded-3xl p-8 text-left space-y-5 mb-10 border border-white/5 backdrop-blur-sm">
                            <div className="flex justify-between border-b border-white/5 pb-5">
                                <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Phim</span>
                                <span className="font-black text-white text-right">{bookingSuccess.movieTitle}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-5">
                                <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Thời gian</span>
                                <span className="font-bold text-white text-right">{formatFullDate(bookingSuccess.bookingTime)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-5">
                                <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Ghế đã đặt</span>
                                <span className="font-black text-emerald-400 text-right text-lg">{bookingSuccess.seatLocations.join(', ')}</span>
                            </div>
                            {bookingSuccess.snacks && bookingSuccess.snacks.length > 0 && (
                                <div className="flex justify-between border-b border-white/5 pb-5">
                                    <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Đồ ăn / Combo</span>
                                    <span className="font-bold text-blue-400 text-right">{bookingSuccess.snacks.join(', ')}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 items-center">
                                <span className="text-slate-400 uppercase tracking-widest text-xs font-black">Tổng thanh toán</span>
                                <span className="font-black text-3xl text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{formatCurrency(bookingSuccess.totalAmount)}</span>
                            </div>
                        </div>
                        
                        <Button className="w-full h-16 text-xl font-black italic uppercase shadow-[0_0_20px_rgba(37,99,235,0.4)]" onClick={() => navigate('/movies')}>
                            QUAY LẠI TRANG CHỦ
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const physicalSeatCount = selectedSeats.length;
    const totalSelectedSeats = selectedSeats.reduce((sum, s) => sum + (s.seatCount || 1), 0);
    const totalSelectedTickets = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);
    const isTicketsMatched = totalSelectedTickets === totalSelectedSeats;
    
    let totalPrice = 0;
    let totalSeatSurcharge = 0;

    Object.entries(ticketQuantities).forEach(([typeId, qty]) => {
        const t = ticketTypes.find(type => type.id === Number(typeId));
        if (t) {
            const override = pricing?.ticketPrices?.find(p => p.ticketTypeId === t.id);
            totalPrice += (override ? override.price : t.basePrice) * qty;
        }
    });

    selectedSeats.forEach(seat => {
        if (seat.seatTypeId) {
            const override = pricing?.seatPrices?.find(p => p.seatTypeId === seat.seatTypeId);
            if (override && override.surcharge > 0) {
                totalSeatSurcharge += override.surcharge;
                totalPrice += override.surcharge;
            }
        }
    });

    Object.entries(snackQuantities).forEach(([snackId, qty]) => {
        const s = snacks.find(snack => snack.id === Number(snackId));
        if (s) totalPrice += s.basePrice * qty;
    });

    return (
        <div className="w-full animate-in fade-in duration-500 pb-20">
            {/* Header Info - Cinematic Style */}
            <div className="w-full bg-[#0A0A0A] border-b border-white/5 sticky top-0 z-30 shadow-2xl backdrop-blur-xl">
                <div className="container mx-auto px-4 md:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            {showtime.movie?.posterUrl && (
                                <img src={showtime.movie.posterUrl} alt={showtime.movie.title} className="w-12 h-16 object-cover rounded shadow-md hidden sm:block" />
                            )}
                            <div>
                                <h1 className="text-xl md:text-2xl font-black text-white uppercase italic">{showtime.movie?.title}</h1>
                                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold text-slate-400 mt-1">
                                    <span className="flex items-center gap-1 text-blue-400"><MapPin size={14} /> {showtime.room?.cinema?.name}</span>
                                    <span className="flex items-center gap-1"><MonitorPlay size={14} /> {showtime.room?.name}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {formatTime(showtime.startTime)} - {formatFullDate(showtime.startTime)}</span>
                                </div>
                            </div>
                        </div>
                        {/* Countdown Timer Placeholder */}
                        <div className="hidden lg:flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg text-red-500">
                            <Clock size={18} className="animate-pulse" />
                            <span className="font-mono font-bold text-lg">05:00</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 mt-8">
                {error && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm font-bold text-red-400 mb-8 shadow-lg backdrop-blur-md flex items-center gap-3">
                        <Info className="flex-shrink-0" /> {error}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-12 relative items-start">
                    {/* Left Panel: Seat Selection */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="border-white/5 bg-[#121212]/90 p-8 backdrop-blur-md overflow-hidden flex flex-col items-center shadow-2xl rounded-3xl relative">
                            {/* Cinematic Glow Screen */}
                            <div className="w-[85%] h-12 border-t-[6px] border-blue-500/80 rounded-[50%] mb-24 relative flex justify-center shadow-[0_-30px_60px_rgba(37,99,235,0.25)] bg-gradient-to-t from-blue-900/10 to-transparent">
                                <span className="absolute -top-5 text-[10px] font-black uppercase tracking-widest text-blue-300 bg-[#0A0A0A] px-6 py-1.5 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-500/40">
                                    MÀN HÌNH CHÍNH
                                </span>
                            </div>
                            
                            {/* Seats Grid (Horizontal Scroll on Mobile) */}
                            <div className="w-full overflow-x-auto custom-scrollbar pb-8 flex justify-center">
                                <div className="flex flex-col gap-3 min-w-max">
                                    {grid.length === 0 ? (
                                        <div className="py-12 text-center text-slate-500 italic">
                                            Phòng chiếu này chưa được thiết lập sơ đồ ghế.
                                        </div>
                                    ) : grid.map((rowArr, r) => (
                                        <div key={r} className="flex gap-2 items-center justify-center">
                                            <div className="w-6 font-black text-xs text-slate-600 text-right pr-3 uppercase tracking-widest">
                                                {indexToLetter(r)}
                                            </div>
                                            {rowArr.map((seat, c) => {
                                                const prevSeat = c > 0 ? rowArr[c - 1] : null;
                                                if (prevSeat && prevSeat.seatCount && prevSeat.seatCount >= 2) {
                                                    return null; // Skip rendering the right half for double seats
                                                }

                                                if (!seat) {
                                                    return <div key={`empty-${r}-${c}`} className="w-9 h-9 flex-shrink-0" />;
                                                }
                                                
                                                const isSelected = selectedSeats.some(s => s.id === seat.id);
                                                const isVIP = seat.seatTypeName?.toLowerCase().includes('vip');
                                                const isCouple = seat.seatCount && seat.seatCount >= 2;
                                                
                                                let colorClass = 'bg-slate-800 border-white/10 text-slate-400 hover:bg-slate-700 hover:border-slate-500';
                                                if (isVIP) colorClass = 'bg-yellow-900/30 border-yellow-500/30 text-yellow-500 hover:bg-yellow-600/40 hover:border-yellow-400';
                                                if (isCouple) colorClass = 'bg-pink-900/30 border-pink-500/30 text-pink-400 hover:bg-pink-600/40 hover:border-pink-400';
                                                
                                                if (isSelected) {
                                                    colorClass = 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.6)] text-white transform scale-110 z-10';
                                                }

                                                const widthClass = isCouple ? 'w-[80px]' : 'w-9';

                                                return (
                                                    <div 
                                                        key={seat.id}
                                                        onClick={() => handleSeatClick(seat)}
                                                        className={`${widthClass} h-9 flex-shrink-0 rounded-t-xl rounded-b-md border-b-[3px] border-l-[1px] border-r-[1px] border-t-[1px] cursor-pointer flex items-center justify-center text-[10px] font-black transition-all duration-200 ${colorClass}`}
                                                        title={`${seat.seatLocation} - ${seat.seatTypeName} (${seat.seatCount || 1} người)`}
                                                    >
                                                        {isCouple ? `${c + 1}-${c + 2}` : c + 1}
                                                    </div>
                                                );
                                            })}
                                            <div className="w-6 font-black text-xs text-slate-600 pl-3 uppercase tracking-widest">
                                                {indexToLetter(r)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-bold text-slate-400 bg-white/5 px-8 py-4 rounded-full border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-t-md rounded-b-sm bg-slate-800 border border-white/10" /> Thường
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-t-md rounded-b-sm bg-yellow-900/30 border border-yellow-500/30" /> VIP
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-6 rounded-t-md rounded-b-sm bg-pink-900/30 border border-pink-500/30" /> Đôi
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-t-md rounded-b-sm bg-blue-600 border border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]" /> Đang chọn
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-t-md rounded-b-sm bg-zinc-800 border border-zinc-700 opacity-50 cursor-not-allowed text-zinc-500 flex items-center justify-center font-black">X</div> Đã bán
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Panel: Tickets & Checkout (Sticky Sidebar) */}
                    <div className="lg:col-span-4 sticky top-28 space-y-6">
                        {selectedSeats.length > 0 && (
                            <Card className="border-blue-500/30 bg-blue-900/10 p-6 backdrop-blur-md shadow-[0_0_30px_rgba(37,99,235,0.1)] rounded-3xl animate-in zoom-in-95 duration-300">
                                <h3 className="font-black text-blue-400 mb-4 border-b border-blue-500/20 pb-4 flex items-center gap-2 uppercase italic">
                                    <Armchair size={18} /> Ghế đang chọn
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map(s => (
                                        <span key={s.id} className="bg-blue-600 text-white border border-blue-400 px-3 py-1.5 rounded-lg text-sm font-black shadow-lg">
                                            {s.seatLocation}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        )}

                        <Card className="border-white/5 bg-[#121212]/90 p-6 backdrop-blur-md rounded-3xl shadow-2xl">
                            <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-4">
                                <h3 className="font-black text-white uppercase tracking-widest text-sm">Chọn Loại Vé</h3>
                                <span className={`text-xs font-black px-3 py-1.5 rounded-lg ${isTicketsMatched ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                                    Đã chọn: {totalSelectedTickets} / {totalSelectedSeats}
                                </span>
                            </div>
                            
                            <div className="space-y-3">
                                {ticketTypes.map(ticket => (
                                    <div key={ticket.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <p className="font-bold text-slate-200 text-sm">{ticket.name}</p>
                                            <p className="text-xs text-emerald-400 font-bold mt-1">
                                                {formatCurrency(pricing?.ticketPrices?.find(p => p.ticketTypeId === ticket.id)?.price ?? ticket.basePrice)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-[#0A0A0A] rounded-full p-1 border border-white/10">
                                            <button 
                                                onClick={() => handleTicketChange(ticket.id, -1)}
                                                disabled={ticketQuantities[ticket.id] === 0 || totalSelectedSeats === 0}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/20 transition-colors font-bold"
                                            >-</button>
                                            <span className="w-6 text-center font-black text-sm text-white">{ticketQuantities[ticket.id]}</span>
                                            <button 
                                                onClick={() => handleTicketChange(ticket.id, 1)}
                                                disabled={totalSelectedTickets >= totalSelectedSeats || totalSelectedSeats === 0}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/20 transition-colors font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {snacks.length > 0 && (
                            <Card className="border-white/5 bg-[#121212]/90 p-6 backdrop-blur-md rounded-3xl shadow-2xl">
                                <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-4">
                                    <h3 className="font-black text-white flex items-center gap-2 uppercase tracking-widest text-sm">
                                        <Coffee size={18} className="text-orange-400" /> Bắp Nước (Tùy chọn)
                                    </h3>
                                </div>
                                
                                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                    {snacks.map(snack => (
                                        <div key={snack.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="pr-4">
                                                <p className="font-bold text-slate-200 text-sm line-clamp-1">{snack.name}</p>
                                                <p className="text-[10px] font-bold uppercase text-slate-500 mt-0.5">{snack.snackTypeName}</p>
                                                <p className="text-xs font-black text-orange-400 mt-1">{formatCurrency(snack.basePrice)}</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-[#0A0A0A] rounded-full p-1 border border-white/10 shrink-0">
                                                <button 
                                                    onClick={() => handleSnackChange(snack.id, -1)}
                                                    disabled={snackQuantities[snack.id] === 0 || totalSelectedSeats === 0}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/20 transition-colors font-bold"
                                                >-</button>
                                                <span className="w-6 text-center font-black text-sm text-white">{snackQuantities[snack.id]}</span>
                                                <button 
                                                    onClick={() => handleSnackChange(snack.id, 1)}
                                                    disabled={totalSelectedSeats === 0}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/20 transition-colors font-bold"
                                                >+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        <Card className="border-blue-500/40 bg-gradient-to-br from-[#121212] to-blue-900/20 p-6 backdrop-blur-md shadow-[0_10px_40px_rgba(37,99,235,0.15)] rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                            
                            {totalSeatSurcharge > 0 && (
                                <div className="flex justify-between items-center mb-4 relative z-10 border-b border-white/5 pb-3">
                                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Phụ thu ghế ({physicalSeatCount} vị trí)</span>
                                    <span className="text-sm font-black text-orange-400">+{formatCurrency(totalSeatSurcharge)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <span className="text-slate-300 font-black uppercase tracking-widest text-sm">Tổng cộng</span>
                                <span className="text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{formatCurrency(totalPrice)}</span>
                            </div>
                            
                            <Button 
                                className={`w-full h-16 gap-3 text-xl font-black italic uppercase transition-all duration-300 relative z-10 ${isTicketsMatched && totalSelectedSeats > 0 ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.5)] text-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                                onClick={handleCheckout}
                                disabled={loading || totalSelectedSeats === 0 || !isTicketsMatched}
                            >
                                <CreditCard size={24} /> {isTicketsMatched && totalSelectedSeats > 0 ? 'THANH TOÁN NGAY' : 'CHỌN ĐỦ VÉ'}
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
