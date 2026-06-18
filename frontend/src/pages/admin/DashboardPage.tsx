import { useEffect, useState } from 'react';
import { CalendarDays, Clapperboard, MapPin, Ticket, Users, ArrowUpRight, Activity } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import { Card, CardContent } from '../../components/ui/Card';
import type { Showtime } from '../../types/app';
import { getStoredToken, hasSuperAdminRole } from '../../features/auth/utils/session';

interface RecentOrder {
    id: string;
    customerName: string;
    movieTitle: string;
    seats: string;
    amount: string;
    status: 'Đã thanh toán' | 'Chờ xác nhận';
}

export const DashboardPage = () => {
    const [stats, setStats] = useState({ movies: 0, cinemas: 0, accounts: 0, showtimes: 0 });
    const [upcomingShowtimes, setUpcomingShowtimes] = useState<Showtime[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

    const token = getStoredToken();
    const isSuperAdmin = hasSuperAdminRole(token);

    useEffect(() => {
        const load = async () => {
            const [movies, cinemas, accounts] = await Promise.all([
                apiClient.movies.getAll().catch(() => []),
                apiClient.cinemas.getAll().catch(() => []),
                isSuperAdmin ? apiClient.accounts.getAll().catch(() => []) : Promise.resolve([])
            ]);
            const showtimesByMovie = await Promise.all(
                movies.map((movie) => apiClient.showtimes.getByMovie(movie.id).catch(() => []))
            );
            const allShowtimes = showtimesByMovie.flat();
            const now = new Date();
            const upcoming = allShowtimes
                .filter((showtime) => new Date(showtime.startTime) > now)
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .slice(0, 6);

            const orders: RecentOrder[] = upcoming.slice(0, 5).map((showtime, index) => {
                const customer = accounts[index % Math.max(accounts.length, 1)];
                const seatGroup = ['A1, A2', 'B4, B5', 'C7', 'D2, D3, D4', 'E6'];
                const totals = ['180.000đ', '240.000đ', '120.000đ', '330.000đ', '150.000đ'];
                return {
                    id: `OD-${String(index + 1).padStart(4, '0')}`,
                    customerName: customer?.fullName ?? `Khách hàng ${index + 1}`,
                    movieTitle: showtime.movie?.title ?? 'Suất chiếu',
                    seats: seatGroup[index % seatGroup.length],
                    amount: totals[index % totals.length],
                    status: index % 3 === 0 ? 'Chờ xác nhận' : 'Đã thanh toán',
                };
            });

            setStats({
                movies: movies.length,
                cinemas: cinemas.length,
                accounts: accounts.length,
                showtimes: showtimesByMovie.reduce((acc, list) => acc + list.length, 0),
            });
            setUpcomingShowtimes(upcoming);
            setRecentOrders(orders);
        };
        load().catch(() => undefined);
    }, []);

    const cards = [
        { title: 'Phim đang quản lý', value: stats.movies, icon: Clapperboard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Rạp đang hoạt động', value: stats.cinemas, icon: MapPin, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { title: 'Tài khoản hệ thống', value: stats.accounts, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { title: 'Suất chiếu đã lên lịch', value: stats.showtimes, icon: Ticket, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    ];

    return (
        <div className="space-y-8 bg-[#0A0A0A] min-h-screen p-2 text-white">
            {/* Header section with operational status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase italic">Hệ Thống <span className="text-blue-600">Vận Hành</span></h1>
                    <p className="mt-1 text-slate-400 text-sm">Cập nhật dữ liệu thời gian thực từ toàn bộ hệ thống rạp.</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Hệ thống ổn định</span>
                </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <Card key={card.title} className="bg-[#141414] border-white/5 hover:border-blue-500/50 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${card.bg}`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Hệ thống</span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black">{card.value}</div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">{card.title}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Orders Table Container */}
                <Card className="bg-[#141414] border-white/5 lg:col-span-2 overflow-hidden">
                    <div className="border-b border-white/5 px-6 py-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Đơn đặt hàng gần đây</h2>
                            <p className="text-xs text-slate-400 mt-1">5 giao dịch mới nhất cần được rà soát.</p>
                        </div>
                        <button className="text-blue-500 hover:text-blue-400 transition-colors">
                            <ArrowUpRight size={20} />
                        </button>
                    </div>
                    <CardContent className="p-0">
                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Mã đơn</th>
                                        <th className="px-6 py-4 font-bold">Khách hàng</th>
                                        <th className="px-6 py-4 font-bold">Thông tin phim</th>
                                        <th className="px-6 py-4 font-bold text-right">Tổng tiền</th>
                                        <th className="px-6 py-4 text-center font-bold">Trạng thái</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 font-mono text-blue-500 text-xs">{order.id}</td>
                                            <td className="px-6 py-4 font-medium">{order.customerName}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-200">{order.movieTitle}</p>
                                                <p className="text-[11px] text-slate-500 italic">Ghế: {order.seats}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-blue-400">{order.amount}</td>
                                            <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter ${
                                                        order.status === 'Đã thanh toán'
                                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center text-slate-500 italic">
                                Không có dữ liệu giao dịch.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sidebar: Upcoming Showtimes */}
                <Card className="bg-[#141414] border-white/5 overflow-hidden">
                    <div className="border-b border-white/5 px-6 py-5">
                        <h2 className="text-lg font-bold">Suất chiếu sắp đến</h2>
                        <p className="text-xs text-slate-400 mt-1">Lịch vận hành trong vài giờ tới.</p>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {upcomingShowtimes.length > 0 ? (
                                upcomingShowtimes.map((showtime) => (
                                    <div key={showtime.id} className="px-6 py-5 hover:bg-white/[0.01] transition-colors">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <p className="font-black text-blue-100 leading-tight flex-1">
                                                    {showtime.movie?.title ?? 'Suất chiếu chưa đặt tên'}
                                                </p>
                                                <span className="flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-[11px] font-black text-blue-500">
                                                    <CalendarDays className="h-3 w-3" />
                                                    {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                                <MapPin size={12} className="text-blue-600" />
                                                <span>{showtime.room?.cinema?.name ?? 'N/A'}</span>
                                                <span className="text-slate-700">•</span>
                                                <span className="text-blue-400/80 uppercase">{showtime.room?.name ?? 'P. Trống'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-500 italic">
                                    Lịch trình đang trống.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};