import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { apiClient } from '../../api/axiosClient';
import type { BookingHistoryResponse, Account } from '../../types/app';
import { getStoredAccount } from '../../features/auth/utils/session';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Film, Calendar, MapPin, Clock, Ticket, QrCode, X } from 'lucide-react';

export function ProfilePage() {
    const [bookings, setBookings] = useState<BookingHistoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<Account | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<BookingHistoryResponse | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const storedAccount = getStoredAccount();
                if (storedAccount) setAccount(storedAccount);
                const data = await apiClient.bookings.getMyBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const now = new Date();
    const upcomingBookings = bookings.filter(b => new Date(b.showtimeStartTime) > now && b.paymentStatus === 'PAID');
    const historyBookings = bookings.filter(b => new Date(b.showtimeStartTime) <= now || b.paymentStatus !== 'PAID');

    const displayBookings = activeTab === 'upcoming' ? upcomingBookings : historyBookings;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Profile Info */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md sticky top-24">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-3xl font-bold">
                                    {account?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-center mb-2">{account?.fullName}</h2>
                            <p className="text-zinc-400 text-center text-sm mb-6">{account?.email}</p>
                            
                            <div className="space-y-2">
                                <button 
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'upcoming' ? 'bg-red-600 text-white' : 'hover:bg-white/5 text-zinc-300'}`}
                                >
                                    Vé sắp chiếu ({upcomingBookings.length})
                                </button>
                                <button 
                                    onClick={() => setActiveTab('history')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-red-600 text-white' : 'hover:bg-white/5 text-zinc-300'}`}
                                >
                                    Lịch sử đặt vé ({historyBookings.length})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bookings List */}
                    <div className="w-full md:w-2/3">
                        <h1 className="text-3xl font-bold mb-6">
                            {activeTab === 'upcoming' ? 'Vé sắp chiếu' : 'Lịch sử giao dịch'}
                        </h1>

                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                            </div>
                        ) : displayBookings.length === 0 ? (
                            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-12 text-center">
                                <Ticket className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                                <p className="text-zinc-400">Bạn chưa có vé nào ở mục này.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {displayBookings.map((booking) => (
                                    <div key={booking.id} className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-red-500/50 transition-colors">
                                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                                            {booking.moviePosterUrl ? (
                                                <img src={booking.moviePosterUrl} alt={booking.movieTitle} className="w-full sm:w-32 h-48 object-cover rounded-lg" />
                                            ) : (
                                                <div className="w-full sm:w-32 h-48 bg-zinc-800 rounded-lg flex items-center justify-center">
                                                    <Film className="text-zinc-600 w-12 h-12" />
                                                </div>
                                            )}
                                            
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xl font-bold">{booking.movieTitle}</h3>
                                                        <span className={`px-2 py-1 text-xs rounded font-medium ${booking.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                            {booking.paymentStatus}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="space-y-2 text-sm text-zinc-300">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-zinc-500" />
                                                            <span>{booking.cinemaName} - {booking.roomName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-zinc-500" />
                                                            <span>{format(new Date(booking.showtimeStartTime), 'dd MMMM yyyy', { locale: vi })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-zinc-500" />
                                                            <span>{format(new Date(booking.showtimeStartTime), 'HH:mm')} - {format(new Date(booking.showtimeEndTime), 'HH:mm')}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-4 pt-4 border-t border-white/10 text-sm flex flex-wrap gap-x-6 gap-y-2">
                                                        <div><span className="text-zinc-500">Ghế:</span> {booking.seats.join(', ')}</div>
                                                        <div><span className="text-zinc-500">Tổng tiền:</span> {booking.totalAmount.toLocaleString('vi-VN')} đ</div>
                                                    </div>
                                                </div>
                                                
                                                {booking.paymentStatus === 'PAID' && (
                                                    <button 
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="mt-4 w-full sm:w-auto self-end flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                        Xem vé
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ticket Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
                        <button 
                            onClick={() => setSelectedBooking(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-600 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="p-8 text-center bg-gradient-to-b from-red-900/20 to-zinc-900">
                            <h2 className="text-2xl font-bold mb-2">VÉ ĐIỆN TỬ</h2>
                            <p className="text-zinc-400 text-sm mb-6">Mã giao dịch: {selectedBooking.id.substring(0, 8).toUpperCase()}</p>
                            
                            <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                <QRCodeCanvas value={selectedBooking.id} size={200} level="H" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-red-500 mb-4">{selectedBooking.movieTitle}</h3>
                            
                            <div className="grid grid-cols-2 gap-4 text-left text-sm bg-black/40 p-4 rounded-xl">
                                <div>
                                    <p className="text-zinc-500 text-xs">Rạp</p>
                                    <p className="font-semibold">{selectedBooking.cinemaName}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs">Phòng chiếu</p>
                                    <p className="font-semibold">{selectedBooking.roomName}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs">Thời gian</p>
                                    <p className="font-semibold">{format(new Date(selectedBooking.showtimeStartTime), 'HH:mm dd/MM')}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs">Ghế</p>
                                    <p className="font-semibold text-red-400">{selectedBooking.seats.join(', ')}</p>
                                </div>
                            </div>
                            
                            <p className="mt-6 text-xs text-zinc-500">Vui lòng đưa mã QR này cho nhân viên để quét khi vào rạp.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
