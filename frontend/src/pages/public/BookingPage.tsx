import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Gift, CreditCard, Ticket, Check, Calendar, Clock, MapPin, Film, Armchair, Plus, Minus } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Movie, Showtime } from '../../types/app';
import { getStoredAccount, getStoredUser } from '../../features/auth/utils/session';

interface SnackItem {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export const BookingPage = () => {
    const { movieId, showtimeId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialFormat = (searchParams.get('format') as '2D' | '3D' | 'IMAX') || '2D';
    const [movieFormat, setMovieFormat] = useState<'2D' | '3D' | 'IMAX'>(initialFormat);
    
    const [movie, setMovie] = useState<Movie | null>(null);
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Step state: 1 = Seat & Snacks, 2 = Checkout & Payment, 3 = Success Ticket
    const [step, setStep] = useState<1 | 2 | 3>(1);
    
    // Seat selection state
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    
    // Snack selection state
    const [snacks, setSnacks] = useState<SnackItem[]>([
        { id: 'snack-1', name: 'Combo Solo', description: '1 Bắp ngọt (L) + 1 Nước ngọt (L)', price: 75000, quantity: 0 },
        { id: 'snack-2', name: 'Combo Couple', description: '1 Bắp ngọt (L) + 2 Nước ngọt (L)', price: 105000, quantity: 0 },
        { id: 'snack-3', name: 'Bắp Ngọt Lẻ', description: '1 Hộp bắp rang bơ vị ngọt thơm', price: 50000, quantity: 0 },
        { id: 'snack-4', name: 'Nước Ngọt Lẻ', description: '1 Ly nước ngọt có ga lạnh sảng khoái', price: 35000, quantity: 0 }
    ]);
    
    // Promo/Member state
    const loggedInAccount = getStoredAccount();
    const loggedInUser = getStoredUser();
    const [memberEmail, setMemberEmail] = useState(loggedInAccount?.email || '');
    const [isPromoApplied, setIsPromoApplied] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'vnpay' | 'card'>('momo');
    const [processingPayment, setProcessingPayment] = useState(false);
    const [orderId, setOrderId] = useState('');

    // Fetch movie and find showtime
    useEffect(() => {
        if (!movieId || !showtimeId) return;
        setLoading(true);
        
        const fetchData = async () => {
            try {
                const movieData = await apiClient.movies.getById(movieId);
                setMovie(movieData);
                
                const showtimesList = await apiClient.showtimes.getByMovie(movieId);
                const matchedShowtime = showtimesList.find(st => st.id === showtimeId);
                if (matchedShowtime) {
                    setShowtime(matchedShowtime);
                }
            } catch (err) {
                console.error('Failed to load booking details:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
        
        // Generate random order ID
        const randId = 'HUS' + Math.floor(100000 + Math.random() * 900000);
        setOrderId(randId);
    }, [movieId, showtimeId]);

    // Generate occupied seats based on showtimeId
    const occupiedSeats = useMemo(() => {
        if (!showtimeId) return new Set<string>();
        let hash = 0;
        for (let i = 0; i < showtimeId.length; i++) {
            hash = showtimeId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const occupied = new Set<string>();
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const cols = 10;
        
        const rand = () => {
            const x = Math.sin(hash++) * 10000;
            return x - Math.floor(x);
        };
        
        rows.forEach(r => {
            for (let c = 1; c <= cols; c++) {
                // 35% chance a seat is already occupied
                if (rand() < 0.35) {
                    occupied.add(`${r}${c}`);
                }
            }
        });
        return occupied;
    }, [showtimeId]);

    // Seat pricing
    const getSeatPrice = (seatCode: string): number => {
        const row = seatCode.charAt(0);
        let basePrice = 80000; // Standard Seats rows A-D
        if (row === 'H') basePrice = 180000; // Couple Seats row H
        else if (['E', 'F', 'G'].includes(row)) basePrice = 110000; // VIP Seats rows E-G
        
        if (movieFormat === '3D') return basePrice + 30000;
        if (movieFormat === 'IMAX') return basePrice + 70000;
        return basePrice;
    };

    const getSeatTypeLabel = (seatCode: string): string => {
        const row = seatCode.charAt(0);
        if (row === 'H') return 'Ghế Đôi (Couple)';
        if (['E', 'F', 'G'].includes(row)) return 'Ghế VIP';
        return 'Ghế Thường (Standard)';
    };

    // Calculate totals
    const seatsTotal = useMemo(() => {
        return selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
    }, [selectedSeats, movieFormat]);

    const snacksTotal = useMemo(() => {
        return snacks.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [snacks]);

    const subTotal = seatsTotal + snacksTotal;

    const discountAmount = useMemo(() => {
        return isPromoApplied ? Math.round(subTotal * 0.2) : 0; // 20% discount
    }, [isPromoApplied, subTotal]);

    const finalTotal = subTotal - discountAmount;

    // Handle seat select/deselect
    const toggleSeat = (seatCode: string) => {
        if (occupiedSeats.has(seatCode)) return;
        
        setSelectedSeats(prev => 
            prev.includes(seatCode)
                ? prev.filter(s => s !== seatCode)
                : [...prev, seatCode]
        );
    };

    // Handle snack quantity changes
    const updateSnackQuantity = (id: string, delta: number) => {
        setSnacks(prev => 
            prev.map(item => 
                item.id === id 
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item
            )
        );
    };

    // Apply 20% member promo discount
    const applyPromo = () => {
        if (!memberEmail || !memberEmail.includes('@')) {
            alert('Vui lòng nhập đúng định dạng email thành viên!');
            return;
        }
        setIsPromoApplied(true);
        alert('Áp dụng ưu đãi thành viên thành công! Giảm giá 20% đã được ghi nhận.');
    };

    // Confirm fake payment
    const handlePayment = () => {
        setProcessingPayment(true);
        setTimeout(() => {
            setProcessingPayment(false);
            setStep(3);
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!movie || !showtime) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] text-slate-400">
                <p className="text-xl font-medium">Không tìm thấy thông tin phòng chiếu hoặc suất chiếu.</p>
                <Button variant="ghost" className="mt-4 text-blue-500" onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
        );
    }

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const columns = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 text-white font-sans selection:bg-blue-600/30">
            <div className="container mx-auto px-4 lg:px-8">
                
                {/* Header Back Link & Steps Indicator */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between border-b border-white/5 pb-6 mb-8">
                    <button 
                        onClick={() => step > 1 ? setStep((prev) => (prev - 1) as 1 | 2) : navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Quay lại
                    </button>
                    
                    {/* Step wizard status bar */}
                    <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase">
                        <span className={`${step === 1 ? 'text-blue-500' : 'text-slate-500'}`}>1. Chọn Ghế & Bắp Nước</span>
                        <span className="text-slate-700">/</span>
                        <span className={`${step === 2 ? 'text-blue-500' : 'text-slate-500'}`}>2. Thanh Toán</span>
                        <span className="text-slate-700">/</span>
                        <span className={`${step === 3 ? 'text-emerald-500' : 'text-slate-500'}`}>3. Hoàn Tất</span>
                    </div>
                </div>

                {step === 1 && (
                    <div className="grid gap-10 lg:grid-cols-12">
                        {/* Left Side: Seat Layout Grid */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Format Selector Selector */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-zinc-950/40 rounded-3xl border border-white/5">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-400">Chọn định dạng chiếu</h4>
                                    <p className="text-xs text-slate-500">Giá vé tự động điều chỉnh tương ứng với định dạng chiếu đã chọn</p>
                                </div>
                                <div className="flex gap-2">
                                    {(['2D', '3D', 'IMAX'] as const).map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => {
                                                setMovieFormat(fmt);
                                                setSearchParams({ format: fmt });
                                            }}
                                            className={`px-4.5 py-2.5 rounded-xl text-xs font-black italic tracking-wider transition-all active:scale-95 border cursor-pointer ${
                                                movieFormat === fmt
                                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                            }`}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Screen Glow Representation */}
                            <div className="relative w-full flex flex-col items-center">
                                <div className="w-[85%] h-2.5 rounded-full bg-blue-500/20 shadow-2xl shadow-blue-500/70 border-b border-blue-400/50" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-2">Màn Hình Chiếu ({movieFormat})</span>
                            </div>
                            
                            {/* Grid Seats Container */}
                            <div className="overflow-x-auto pb-4">
                                <div className="min-w-[550px] flex flex-col gap-3.5 items-center justify-center p-6 bg-zinc-950/20 rounded-3xl border border-white/5">
                                    {rows.map((row) => (
                                        <div key={row} className="flex items-center gap-4">
                                            {/* Row label left */}
                                            <span className="w-5 text-center text-sm font-bold text-slate-600">{row}</span>
                                            
                                            <div className="flex gap-2.5">
                                                {columns.map((col) => {
                                                    const seatCode = `${row}${col}`;
                                                    const isOccupied = occupiedSeats.has(seatCode);
                                                    const isSelected = selectedSeats.includes(seatCode);
                                                    const isVIP = ['E', 'F', 'G'].includes(row);
                                                    const isCouple = row === 'H';
                                                    
                                                    let seatClass = 'border border-white/10 bg-white/5 hover:border-blue-500 text-slate-400';
                                                    if (isOccupied) {
                                                        seatClass = 'bg-zinc-800 text-zinc-600 cursor-not-allowed border-0';
                                                    } else if (isSelected) {
                                                        seatClass = 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30';
                                                    } else if (isVIP) {
                                                        seatClass = 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/20 text-amber-500 hover:border-amber-500';
                                                    } else if (isCouple) {
                                                        seatClass = 'border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/20 text-pink-500 hover:border-pink-500';
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={seatCode}
                                                            disabled={isOccupied}
                                                            onClick={() => toggleSeat(seatCode)}
                                                            className={`h-9 w-9 text-[11px] font-black rounded-lg transition-all flex items-center justify-center ${seatClass}`}
                                                            title={`${seatCode} - ${getSeatTypeLabel(seatCode)}`}
                                                        >
                                                            {seatCode}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Row label right */}
                                            <span className="w-5 text-center text-sm font-bold text-slate-600">{row}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Seats Legend */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 py-3 border-y border-white/5 bg-zinc-950/10 rounded-2xl">
                                <div className="flex items-center gap-2">
                                    <div className="h-4.5 w-4.5 rounded bg-white/5 border border-white/10" />
                                    <span>Ghế thường ({movieFormat === '2D' ? '80k' : movieFormat === '3D' ? '110k' : '150k'})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4.5 w-4.5 rounded bg-amber-500/5 border border-amber-500/30" />
                                    <span className="text-amber-500">Ghế VIP ({movieFormat === '2D' ? '110k' : movieFormat === '3D' ? '140k' : '180k'})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4.5 w-4.5 rounded bg-pink-500/5 border border-pink-500/30" />
                                    <span className="text-pink-500">Ghế đôi ({movieFormat === '2D' ? '180k' : movieFormat === '3D' ? '210k' : '250k'})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4.5 w-4.5 rounded bg-blue-600 border border-blue-500" />
                                    <span className="text-blue-400">Đang chọn</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4.5 w-4.5 rounded bg-zinc-800" />
                                    <span>Đã có người mua</span>
                                </div>
                            </div>

                            {/* Snacks Counter Grid */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-1.5 rounded-full bg-blue-600" />
                                    <h2 className="text-2xl font-black uppercase italic tracking-tight">Mua Thêm <span className="text-blue-600">Bắp Nước</span></h2>
                                </div>
                                
                                <div className="grid gap-4 md:grid-cols-2">
                                    {snacks.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border border-white/5 bg-zinc-950/40 p-5 rounded-2xl">
                                            <div className="space-y-1 pr-4">
                                                <h4 className="font-bold text-white text-base">{item.name}</h4>
                                                <p className="text-slate-400 text-xs">{item.description}</p>
                                                <p className="text-blue-500 text-sm font-black pt-1">{item.price.toLocaleString('vi-VN')} đ</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 p-1 rounded-xl">
                                                <button
                                                    onClick={() => updateSnackQuantity(item.id, -1)}
                                                    className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-6 text-center text-sm font-black text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateSnackQuantity(item.id, 1)}
                                                    className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Side: Billing Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-8 space-y-6">
                                <Card className="overflow-hidden border-white/10 bg-zinc-900/40 backdrop-blur-md">
                                    {/* Sidebar Header Movie Banner */}
                                    <div className="relative h-32 w-full overflow-hidden">
                                        <img src={movie.posterUrl} alt="" className="w-full h-full object-cover blur-md scale-105 opacity-30" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                                        <div className="absolute bottom-4 left-6 flex items-start gap-4 right-6">
                                            <img src={movie.posterUrl} alt="" className="w-12 h-18 rounded object-cover shadow border border-white/10" />
                                            <div>
                                                <h3 className="font-black italic uppercase text-white line-clamp-1">{movie.title}</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{movie.language}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Sidebar Showtime Info */}
                                    <div className="p-6 border-b border-white/5 space-y-3.5">
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <MapPin size={16} className="text-blue-500 shrink-0" />
                                            <span className="font-bold line-clamp-1">{showtime.room?.cinema?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <Film size={16} className="text-blue-500 shrink-0" />
                                            <span className="font-bold">{showtime.room?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-6 pt-1 text-xs text-slate-400 font-bold uppercase tracking-wide">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-500" />
                                                {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-slate-500" />
                                                {new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Selected Seats summary */}
                                    <div className="p-6 border-b border-white/5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ghế đã chọn</p>
                                            <p className="text-sm font-black text-white">{selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'Chưa chọn'}</p>
                                        </div>
                                        {selectedSeats.length > 0 && (
                                            <div className="flex justify-between items-center text-xs text-slate-400">
                                                <span>Tiền vé</span>
                                                <span className="font-bold text-white">{seatsTotal.toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Selected Snacks summary */}
                                    <div className="p-6 border-b border-white/5 space-y-3 text-xs text-slate-400">
                                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Bắp nước kèm thêm</p>
                                        {snacks.filter(item => item.quantity > 0).map(item => (
                                            <div key={item.id} className="flex justify-between">
                                                <span>{item.name} x{item.quantity}</span>
                                                <span className="font-bold text-white">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        ))}
                                        {snacks.every(item => item.quantity === 0) && (
                                            <p className="italic text-slate-600">Không mua thêm bắp nước</p>
                                        )}
                                    </div>
                                    
                                    {/* Sidebar Total Calculation */}
                                    <div className="p-6 bg-white/[0.01] space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-400">Tổng tạm tính</span>
                                            <span className="text-xl font-black text-blue-500">{subTotal.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                        
                                        <button
                                            disabled={selectedSeats.length === 0}
                                            onClick={() => setStep(2)}
                                            className={`w-full h-12 inline-flex items-center justify-center font-black italic rounded-xl transition-all active:scale-95 text-sm ${
                                                selectedSeats.length > 0
                                                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                                            }`}
                                        >
                                            TIẾP TỤC THANH TOÁN
                                        </button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-12">
                        {/* Left Side Column: Payment Options & Promo */}
                        <div className="md:col-span-7 space-y-6">
                            {/* Member Promo Card */}
                            <Card className="p-6 border-white/10 bg-zinc-900/40">
                                <div className="flex items-center gap-3 mb-4">
                                    <Gift className="text-blue-500 shrink-0" size={20} />
                                    <h3 className="font-black italic uppercase text-white">Ưu Đãi Thành Viên</h3>
                                </div>
                                <p className="text-slate-400 text-xs mb-4">Nhập email thành viên của bạn để nhận ngay 20% giảm giá vào hóa đơn đặt vé.</p>
                                
                                <div className="flex gap-2">
                                    <input 
                                        type="email"
                                        placeholder="Nhập email thành viên..."
                                        value={memberEmail}
                                        onChange={(e) => setMemberEmail(e.target.value)}
                                        disabled={isPromoApplied}
                                        className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-600 disabled:opacity-50"
                                    />
                                    <button 
                                        onClick={applyPromo}
                                        disabled={isPromoApplied || !memberEmail}
                                        className={`px-5 rounded-xl text-xs font-black italic uppercase transition-all active:scale-95 ${
                                            isPromoApplied || !memberEmail
                                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                                : 'bg-white text-zinc-950 hover:bg-slate-200 shadow-md'
                                        }`}
                                    >
                                        Áp Dụng
                                    </button>
                                </div>
                                {isPromoApplied && (
                                    <p className="text-xs text-emerald-500 font-bold mt-3 flex items-center gap-1.5">
                                        <Check size={14} /> Giảm giá 20% đã được áp dụng!
                                    </p>
                                )}
                            </Card>
                            
                            {/* Payment Methods selector */}
                            <Card className="p-6 border-white/10 bg-zinc-900/40 space-y-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-blue-500 shrink-0" size={20} />
                                    <h3 className="font-black italic uppercase text-white">Phương Thức Thanh Toán</h3>
                                </div>
                                
                                <div className="space-y-3 pt-2">
                                    <label className={`flex items-center justify-between border rounded-2xl p-4 cursor-pointer transition-all ${
                                        paymentMethod === 'momo' 
                                            ? 'border-pink-500 bg-pink-500/5' 
                                            : 'border-white/5 bg-zinc-950/20 hover:border-white/10'
                                    }`}>
                                        <div className="flex items-center gap-3.5">
                                            <input 
                                                type="radio" 
                                                checked={paymentMethod === 'momo'} 
                                                onChange={() => setPaymentMethod('momo')}
                                                className="accent-pink-500 h-4 w-4"
                                            />
                                            <div className="flex items-center gap-2.5">
                                                <span className="h-7 w-7 rounded bg-pink-500 text-[10px] font-black text-white flex items-center justify-center">MoMo</span>
                                                <span className="text-sm font-bold text-white">Ví điện tử MoMo</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`flex items-center justify-between border rounded-2xl p-4 cursor-pointer transition-all ${
                                        paymentMethod === 'vnpay' 
                                            ? 'border-blue-500 bg-blue-500/5' 
                                            : 'border-white/5 bg-zinc-950/20 hover:border-white/10'
                                    }`}>
                                        <div className="flex items-center gap-3.5">
                                            <input 
                                                type="radio" 
                                                checked={paymentMethod === 'vnpay'} 
                                                onChange={() => setPaymentMethod('vnpay')}
                                                className="accent-blue-500 h-4 w-4"
                                            />
                                            <div className="flex items-center gap-2.5">
                                                <span className="h-7 w-7 rounded bg-blue-600 text-[10px] font-black text-white flex items-center justify-center">VNPay</span>
                                                <span className="text-sm font-bold text-white">Cổng thanh toán VNPAY</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`flex items-center justify-between border rounded-2xl p-4 cursor-pointer transition-all ${
                                        paymentMethod === 'card' 
                                            ? 'border-emerald-500 bg-emerald-500/5' 
                                            : 'border-white/5 bg-zinc-950/20 hover:border-white/10'
                                    }`}>
                                        <div className="flex items-center gap-3.5">
                                            <input 
                                                type="radio" 
                                                checked={paymentMethod === 'card'} 
                                                onChange={() => setPaymentMethod('card')}
                                                className="accent-emerald-500 h-4 w-4"
                                            />
                                            <div className="flex items-center gap-2.5">
                                                <span className="h-7 w-7 rounded bg-zinc-700 text-[10px] font-black text-white flex items-center justify-center">VISA</span>
                                                <span className="text-sm font-bold text-white">Thẻ tín dụng / Thẻ ghi nợ</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </Card>
                        </div>
                        
                        {/* Right Side Column: Bill Checkout summary */}
                        <div className="md:col-span-5">
                            <Card className="overflow-hidden border-white/10 bg-zinc-900/40 p-6 space-y-6">
                                <h3 className="font-black italic uppercase text-white border-b border-white/5 pb-4 text-lg">Thông Tin Hóa Đơn</h3>
                                
                                <div className="space-y-4 text-sm text-slate-300">
                                    <div className="flex justify-between items-start">
                                        <span className="text-slate-500">Phim</span>
                                        <span className="font-bold text-right text-white max-w-[200px] line-clamp-2 uppercase italic">{movie.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Định dạng</span>
                                        <span className="font-bold text-blue-400">{movieFormat}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Cụm rạp</span>
                                        <span className="font-bold text-white">{showtime.room?.cinema?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Suất chiếu</span>
                                        <span className="font-bold text-white">
                                            {new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Ghế chọn ({selectedSeats.length})</span>
                                        <span className="font-bold text-white">{selectedSeats.sort().join(', ')}</span>
                                    </div>
                                </div>
                                
                                <div className="h-px w-full bg-white/5" />
                                
                                <div className="space-y-3 text-xs text-slate-400">
                                    <div className="flex justify-between">
                                        <span>Tạm tính vé</span>
                                        <span className="font-bold text-white">{seatsTotal.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tạm tính bắp nước</span>
                                        <span className="font-bold text-white">{snacksTotal.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    {isPromoApplied && (
                                        <div className="flex justify-between text-emerald-500">
                                            <span>Thành viên HUS (Giảm 20%)</span>
                                            <span className="font-bold">-{discountAmount.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="h-px w-full bg-white/5" />
                                
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-300">Tổng thanh toán</span>
                                    <span className="text-2xl font-black text-blue-500">{finalTotal.toLocaleString('vi-VN')} đ</span>
                                </div>
                                
                                <button
                                    onClick={handlePayment}
                                    disabled={processingPayment}
                                    className="w-full h-13 inline-flex items-center justify-center font-black italic rounded-xl transition-all active:scale-95 text-base bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                >
                                    {processingPayment ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                    ) : null}
                                    XÁC NHẬN THANH TOÁN
                                </button>
                            </Card>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-md mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                        {/* Status Icon Indicator */}
                        <div className="flex flex-col items-center justify-center text-center space-y-3">
                            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10 animate-bounce">
                                <Check size={32} />
                            </div>
                            <h2 className="text-3xl font-black italic uppercase">Đặt Vé Thành Công</h2>
                            <p className="text-sm text-slate-400">Vé điện tử của bạn đã sẵn sàng. Vui lòng xuất trình mã vé tại quầy check-in.</p>
                        </div>
                        
                        {/* Virtual Cinema Ticket */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-lg shadow-2xl">
                            {/* Ticket top cover banner */}
                            <div className="relative h-28 w-full overflow-hidden">
                                <img src={movie.posterUrl} alt="" className="w-full h-full object-cover blur-sm opacity-35" />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                                <div className="absolute bottom-3 left-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Order ID: {orderId}</span>
                                    <h3 className="font-black italic uppercase text-white text-xl mt-1 line-clamp-1">{movie.title}</h3>
                                </div>
                            </div>
                            
                            {/* Coupon punches layout left & right */}
                            <div className="absolute top-[112px] -left-3 h-6 w-6 rounded-full bg-[#0A0A0A] border-r border-white/10" />
                            <div className="absolute top-[112px] -right-3 h-6 w-6 rounded-full bg-[#0A0A0A] border-l border-white/10" />
                            
                            {/* Ticket details */}
                            <div className="p-6 space-y-4 pt-8">
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Cụm rạp</span>
                                        <p className="font-bold text-white text-sm line-clamp-1">{showtime.room?.cinema?.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Phòng chiếu</span>
                                        <p className="font-bold text-white text-sm">{showtime.room?.name} ({movieFormat})</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Ngày chiếu</span>
                                        <p className="font-bold text-white text-sm">{new Date(showtime.startTime).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Suất chiếu</span>
                                        <p className="font-bold text-white text-sm">{new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Ghế ngồi</span>
                                        <p className="font-bold text-white text-sm">{selectedSeats.sort().join(', ')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Thanh toán</span>
                                        <p className="font-bold text-blue-400 text-sm">{finalTotal.toLocaleString('vi-VN')} đ</p>
                                    </div>
                                </div>
                                
                                {snacks.some(item => item.quantity > 0) && (
                                    <div className="pt-2">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Bắp nước</span>
                                        <p className="font-bold text-slate-300 text-xs mt-1">
                                            {snacks.filter(item => item.quantity > 0).map(item => `${item.name} (x${item.quantity})`).join(', ')}
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Dotted cutting separator line */}
                            <div className="border-t border-dashed border-white/10 mx-6 my-2" />
                            
                            {/* QR code receipt footer */}
                            <div className="p-6 flex flex-col items-center justify-center gap-3">
                                {/* Mock QR code layout */}
                                <div className="h-32 w-32 bg-white rounded-2xl p-2.5 shadow border border-white/5">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HUSTheatre-${orderId}-${selectedSeats.join('-')}`} 
                                        alt="QR Code" 
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quét Mã tại Quầy Vé</span>
                            </div>
                        </div>
                        
                        {/* Navigation back buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 h-12 inline-flex items-center justify-center font-black italic rounded-xl transition-all active:scale-95 text-sm bg-white text-zinc-950 hover:bg-slate-200 shadow-md"
                            >
                                QUAY VỀ TRANG CHỦ
                            </button>
                            <button
                                onClick={() => navigate('/movies')}
                                className="flex-1 h-12 inline-flex items-center justify-center font-black italic rounded-xl transition-all active:scale-95 text-sm border border-white/20 text-white hover:bg-white/5"
                            >
                                XEM PHIM KHÁC
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
