import { useState } from 'react';
import { QrCode, Search, CheckCircle2, XCircle } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';

export const ScanTicketPage = () => {
    const [bookingId, setBookingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheckin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!bookingId.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await apiClient.bookings.checkinTicket(bookingId);
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Lỗi kiểm tra vé. Vé có thể không hợp lệ hoặc đã sử dụng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                    <QrCode className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Soát vé (Check-in)</h1>
                    <p className="text-slate-400 mt-1">Quét mã QR hoặc nhập trực tiếp Mã Đặt Vé để kiểm tra.</p>
                </div>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 shadow-xl">
                <form onSubmit={handleCheckin} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                            placeholder="Nhập mã đặt vé (Booking ID)..."
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !bookingId.trim()}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                        {loading ? 'Đang kiểm tra...' : 'Kiểm tra vé'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4">
                    <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold text-red-500">Vé không hợp lệ</h3>
                        <p className="text-slate-300 mt-2">{error}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex-shrink-0 flex items-center justify-center bg-emerald-500/20 p-4 rounded-full h-16 w-16">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-emerald-500">Xác nhận vé thành công!</h3>
                            <p className="text-emerald-400/80 font-medium">Khách hàng đã được check-in vào rạp.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#1A1A1A] p-4 rounded-xl border border-emerald-500/10">
                            <div>
                                <span className="text-slate-400 text-sm">Phim</span>
                                <p className="text-white font-bold">{result.movieTitle}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm">Phòng chiếu</span>
                                <p className="text-white font-bold">{result.roomName}</p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm">Thời gian</span>
                                <p className="text-white font-bold">
                                    {new Date(result.showtimeStartTime).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm">Ghế ngồi</span>
                                <div className="flex gap-2 flex-wrap mt-1">
                                    {result.seats?.map((seat: string) => (
                                        <span key={seat} className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-sm font-bold border border-emerald-500/20">
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {result.snacks && result.snacks.length > 0 && (
                                <div className="md:col-span-2 mt-2 pt-4 border-t border-white/5">
                                    <span className="text-slate-400 text-sm">Bắp nước đã đặt</span>
                                    <ul className="mt-1 space-y-1">
                                        {result.snacks.map((snack: string) => (
                                            <li key={snack} className="text-white flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                {snack}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
