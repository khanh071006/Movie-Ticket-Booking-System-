import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, Clock, MapPin, MonitorPlay, Coffee } from 'lucide-react';
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
                // We no longer need rows/cols state since we don't render them separately
                
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
        } finally {
            setLoading(false);
        }
    };

    if (loading && !showtime) {
        return <div className="p-20 text-center text-slate-400">Đang tải thông tin...</div>;
    }

    if (!showtime) {
        return (
            <div className="p-20 text-center">
                <p className="text-red-500 font-bold mb-4">{error || 'Không tìm thấy suất chiếu'}</p>
                <Button onClick={() => navigate('/movies')}>Quay lại danh sách phim</Button>
            </div>
        );
    }

    if (bookingSuccess) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-20 animate-in zoom-in duration-500">
                <Card className="border-white/10 bg-zinc-900/50 p-10 text-center backdrop-blur-md">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">ĐẶT VÉ THÀNH CÔNG!</h1>
                    <p className="text-slate-400 mb-8">Mã giao dịch của bạn là: <span className="font-mono text-blue-400 font-bold">#{bookingSuccess.id.split('-')[0].toUpperCase()}</span></p>
                    
                    <div className="bg-white/5 rounded-2xl p-6 text-left space-y-4 mb-8">
                        <div className="flex justify-between border-b border-white/5 pb-4">
                            <span className="text-slate-500">Phim</span>
                            <span className="font-bold text-white">{bookingSuccess.movieTitle}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-4">
                            <span className="text-slate-500">Thời gian</span>
                            <span className="font-bold text-white">{formatFullDate(bookingSuccess.bookingTime)}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-4">
                            <span className="text-slate-500">Ghế đã đặt</span>
                            <span className="font-bold text-blue-400">{bookingSuccess.seatLocations.join(', ')}</span>
                        </div>
                        {bookingSuccess.snacks && bookingSuccess.snacks.length > 0 && (
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-slate-500">Đồ ăn / Combo</span>
                                <span className="font-bold text-blue-400">{bookingSuccess.snacks.join(', ')}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2">
                            <span className="text-slate-500">Tổng tiền thanh toán</span>
                            <span className="font-black text-xl text-emerald-400">{formatCurrency(bookingSuccess.totalAmount)}</span>
                        </div>
                    </div>
                    
                    <Button className="w-full h-14 text-lg font-bold" onClick={() => navigate('/movies')}>
                        Về trang chủ
                    </Button>
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
        <div className="w-full space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
            {/* Header Info */}
            <Card className="border-white/10 bg-zinc-900/50 p-6 backdrop-blur-md">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">{showtime.movie?.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><MapPin size={16} className="text-blue-500" /> {showtime.room?.cinema?.name}</span>
                            <span className="flex items-center gap-1"><MonitorPlay size={16} className="text-blue-500" /> {showtime.room?.name}</span>
                            <span className="flex items-center gap-1"><Clock size={16} className="text-blue-500" /> {formatFullDate(showtime.startTime)} - {formatTime(showtime.startTime)}</span>
                        </div>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Thời lượng</p>
                        <p className="font-bold text-blue-400">{showtime.movie?.durationMinutes} phút</p>
                    </div>
                </div>
            </Card>

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                    {error}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Panel: Seat Selection */}
                <div className="lg:col-span-8">
                    <Card className="border-white/10 bg-zinc-900/50 p-8 backdrop-blur-md overflow-x-auto custom-scrollbar flex flex-col items-center">
                        <div className="w-3/4 h-8 border-t-4 border-blue-500/30 rounded-[50%] mb-12 relative flex justify-center">
                            <span className="absolute -top-3 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-zinc-900 px-4">Màn hình</span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            {grid.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 italic">
                                    Phòng chiếu này chưa được thiết lập sơ đồ ghế. Vui lòng liên hệ Admin.
                                </div>
                            ) : grid.map((rowArr, r) => (
                                <div key={r} className="flex gap-2 items-center">
                                    <div className="w-6 font-bold text-xs text-slate-600 text-right pr-2">
                                        {indexToLetter(r)}
                                    </div>
                                    {rowArr.map((seat, c) => {
                                        const prevSeat = c > 0 ? rowArr[c - 1] : null;
                                        if (prevSeat && prevSeat.seatCount && prevSeat.seatCount >= 2) {
                                            return null; // Skip rendering the right half to prevent row stretching
                                        }

                                        if (!seat) {
                                            return <div key={`empty-${r}-${c}`} className="w-8 h-8 flex-shrink-0" />;
                                        }
                                        
                                        const isSelected = selectedSeats.some(s => s.id === seat.id);
                                        const colorClass = isSelected 
                                            ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] text-white' 
                                            : 'bg-white/10 border-white/20 text-slate-300 hover:bg-white/20';

                                        const widthClass = (seat.seatCount && seat.seatCount >= 2) ? 'w-[72px]' : 'w-8';

                                        return (
                                            <div 
                                                key={seat.id}
                                                onClick={() => handleSeatClick(seat)}
                                                className={`${widthClass} h-8 flex-shrink-0 rounded-t-lg rounded-b-sm border cursor-pointer flex items-center justify-center text-[10px] font-bold transition-all ${colorClass}`}
                                                title={`${seat.seatLocation} - ${seat.seatTypeName} (${seat.seatCount || 1} người)`}
                                            >
                                                {seat.seatCount && seat.seatCount >= 2 ? `${c + 1}-${c + 2}` : c + 1}
                                            </div>
                                        );
                                    })}
                                    <div className="w-6 font-bold text-xs text-slate-600 pl-2">
                                        {indexToLetter(r)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex gap-6 text-xs font-bold text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-t-sm rounded-b-sm bg-white/10 border border-white/20" /> Ghế trống
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-t-sm rounded-b-sm bg-emerald-500 border border-emerald-400" /> Đang chọn
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Tickets & Checkout */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-white/10 bg-zinc-900/50 p-6 backdrop-blur-md">
                        <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-4">Ghế đã chọn</h3>
                        {selectedSeats.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">Chưa có ghế nào được chọn.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {selectedSeats.map(s => (
                                    <span key={s.id} className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-md text-sm font-bold">
                                        {s.seatLocation}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card className="border-white/10 bg-zinc-900/50 p-6 backdrop-blur-md">
                        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                            <h3 className="font-bold text-white">Loại vé</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${isTicketsMatched ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {totalSelectedTickets} / {totalSelectedSeats}
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {ticketTypes.map(ticket => (
                                <div key={ticket.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-bold text-slate-200 text-sm">{ticket.name}</p>
                                        <p className="text-xs text-blue-400">
                                            {formatCurrency(pricing?.ticketPrices?.find(p => p.ticketTypeId === ticket.id)?.price ?? ticket.basePrice)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleTicketChange(ticket.id, -1)}
                                            disabled={ticketQuantities[ticket.id] === 0 || totalSelectedSeats === 0}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                        >-</button>
                                        <span className="w-4 text-center font-bold text-sm text-white">{ticketQuantities[ticket.id]}</span>
                                        <button 
                                            onClick={() => handleTicketChange(ticket.id, 1)}
                                            disabled={totalSelectedTickets >= totalSelectedSeats || totalSelectedSeats === 0}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                        >+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {snacks.length > 0 && (
                        <Card className="border-white/10 bg-zinc-900/50 p-6 backdrop-blur-md">
                            <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Coffee size={18} className="text-blue-500" /> Bắp / Nước uống
                                </h3>
                            </div>
                            
                            <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                {snacks.map(snack => (
                                    <div key={snack.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div>
                                            <p className="font-bold text-slate-200 text-sm">{snack.name}</p>
                                            <p className="text-xs text-slate-500">{snack.snackTypeName}</p>
                                            <p className="text-xs text-blue-400 mt-1">{formatCurrency(snack.basePrice)}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleSnackChange(snack.id, -1)}
                                                disabled={snackQuantities[snack.id] === 0 || totalSelectedSeats === 0}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                            >-</button>
                                            <span className="w-4 text-center font-bold text-sm text-white">{snackQuantities[snack.id]}</span>
                                            <button 
                                                onClick={() => handleSnackChange(snack.id, 1)}
                                                disabled={totalSelectedSeats === 0}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card className="border-emerald-500/30 bg-zinc-900/50 p-6 backdrop-blur-md shadow-lg shadow-emerald-900/10">
                        {totalSeatSurcharge > 0 && (
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-400 font-medium text-sm">Phụ thu ghế ({physicalSeatCount} vị trí)</span>
                                <span className="text-md font-bold text-emerald-400">+{formatCurrency(totalSeatSurcharge)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-400 font-medium">Tổng thanh toán</span>
                            <span className="text-2xl font-black text-emerald-400">{formatCurrency(totalPrice)}</span>
                        </div>
                        
                        <Button 
                            className="w-full h-14 gap-2 text-lg font-bold shadow-xl shadow-emerald-900/20 bg-emerald-600 hover:bg-emerald-500 text-white"
                            onClick={handleCheckout}
                            disabled={loading || totalSelectedSeats === 0 || !isTicketsMatched}
                        >
                            <CreditCard size={20} /> Thanh Toán Ngay
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};
