import { useEffect, useState } from 'react';
import { CalendarDays, Clapperboard, MapPin, Ticket, Users } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import { Card, CardContent } from '../../components/ui/Card';
import type { Showtime } from '../../types/app';

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

    useEffect(() => {
        const load = async () => {
            const [movies, cinemas, accounts] = await Promise.all([apiClient.movies.getAll(), apiClient.cinemas.getAll(), apiClient.accounts.getAll()]);
            const showtimesByMovie = await Promise.all(movies.map((movie) => apiClient.showtimes.getByMovie(movie.id).catch(() => [])));
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
        { title: 'Phim đang quản lý', value: stats.movies, icon: Clapperboard, color: 'text-blue-600 bg-blue-50' },
        { title: 'Rạp đang hoạt động', value: stats.cinemas, icon: MapPin, color: 'text-emerald-600 bg-emerald-50' },
        { title: 'Tài khoản hệ thống', value: stats.accounts, icon: Users, color: 'text-purple-600 bg-purple-50' },
        { title: 'Suất chiếu đã lên lịch', value: stats.showtimes, icon: Ticket, color: 'text-amber-600 bg-amber-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tổng quan vận hành rạp</h1>
                <p className="mt-2 text-slate-500">Theo dõi nhanh tình hình phim, rạp, người dùng và lịch chiếu trong ngày.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <Card key={card.title} className="border-0 ring-1 ring-slate-200">
                        <CardContent className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-600">{card.title}</p>
                                <div className={`rounded-lg p-2 ${card.color}`}>
                                    <card.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">{card.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-0 ring-1 ring-slate-200 lg:col-span-2">
                    <CardContent className="p-0">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-semibold text-slate-900">Đơn đặt hàng gần đây</h2>
                            <p className="mt-1 text-sm text-slate-500">Các giao dịch mới nhất cần theo dõi và xử lý.</p>
                        </div>
                        {recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Mã đơn</th>
                                            <th className="px-6 py-3 font-medium">Khách hàng</th>
                                            <th className="px-6 py-3 font-medium">Phim</th>
                                            <th className="px-6 py-3 font-medium">Ghế</th>
                                            <th className="px-6 py-3 font-medium">Tổng tiền</th>
                                            <th className="px-6 py-3 font-medium">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="bg-white">
                                                <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                                <td className="px-6 py-4 text-slate-700">{order.customerName}</td>
                                                <td className="px-6 py-4 text-slate-700">{order.movieTitle}</td>
                                                <td className="px-6 py-4 text-slate-600">{order.seats}</td>
                                                <td className="px-6 py-4 text-slate-900">{order.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            order.status === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-6 py-10 text-center text-sm text-slate-500">Chưa có đơn đặt hàng mới trong thời gian gần đây.</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-0 ring-1 ring-slate-200">
                    <CardContent className="p-0">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-semibold text-slate-900">Suất chiếu sắp đến</h2>
                            <p className="mt-1 text-sm text-slate-500">Lịch chiếu tiếp theo để chủ động vận hành.</p>
                        </div>
                        <div className="divide-y">
                            {upcomingShowtimes.length > 0 ? (
                                upcomingShowtimes.map((showtime) => (
                                    <div key={showtime.id} className="px-6 py-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-slate-900">{showtime.movie?.title ?? 'Suất chiếu'}</p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {showtime.room?.cinema?.name ?? 'Rạp'} - {showtime.room?.name ?? 'Phòng chiếu'}
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {new Date(showtime.startTime).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-10 text-center text-sm text-slate-500">Hiện chưa có suất chiếu sắp diễn ra.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
