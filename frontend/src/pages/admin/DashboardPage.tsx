import { useEffect, useState } from 'react';
import { CalendarDays, Clapperboard, MapPin, Ticket, Users, ArrowUpRight, Activity, TrendingUp, Star } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import { Card, CardContent } from '../../components/ui/Card';
import type { Showtime } from '../../types/app';
import { getStoredToken, getStoredAccount, hasSuperAdminRole, hasManagerRole } from '../../features/auth/utils/session';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueByDate {
    date: string;
    total: number;
}

interface RevenueByMovie {
    movieTitle: string;
    total: number;
}

interface RevenueByCinema {
    cinemaName: string;
    total: number;
}

export const DashboardPage = () => {
    const [stats, setStats] = useState({ movies: 0, cinemas: 0, accounts: 0, showtimes: 0 });
    const [upcomingShowtimes, setUpcomingShowtimes] = useState<Showtime[]>([]);
    const [topMovies, setTopMovies] = useState<RevenueByMovie[]>([]);
    const [cinemaRevenues, setCinemaRevenues] = useState<RevenueByCinema[]>([]);
    const [dailyRevenues, setDailyRevenues] = useState<RevenueByDate[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [mycinemaName, setMycinemaName] = useState('');

    const token = getStoredToken();
    const isSuperAdmin = hasSuperAdminRole(token);
    const isManager = hasManagerRole(token);
    const account = getStoredAccount();

    useEffect(() => {
        const load = async () => {
            if (isSuperAdmin) {
                const [movies, cinemas, accounts] = await Promise.all([
                    apiClient.movies.getAll().catch(() => []),
                    apiClient.cinemas.getAll().catch(() => []),
                    apiClient.accounts.getAll().catch(() => []),
                ]);

                const showtimesByMovie = await Promise.all(
                    movies.map((movie) => apiClient.showtimes.getByMovie(movie.id).catch(() => []))
                );
                const allShowtimes = showtimesByMovie.flat();
                const now = new Date();
                const upcoming = allShowtimes
                    .filter((s) => new Date(s.startTime) > now)
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .slice(0, 6);

                setStats({
                    movies: movies.length,
                    cinemas: cinemas.length,
                    accounts: accounts.length,
                    showtimes: allShowtimes.length,
                });
                setUpcomingShowtimes(upcoming);

                const [byMovie, byCinema, byDate] = await Promise.all([
                    apiClient.reports.getRevenueByMovie().catch(() => []),
                    apiClient.reports.getRevenueByCinema().catch(() => []),
                    apiClient.reports.getRevenueByDate().catch(() => []),
                ]);
                const sorted = [...byMovie].sort((a, b) => (b.total ?? 0) - (a.total ?? 0)).slice(0, 5);
                setTopMovies(sorted);
                setCinemaRevenues(byCinema.slice(0, 5));
                const total = byCinema.reduce((sum: number, c: RevenueByCinema) => sum + (c.total ?? 0), 0);
                setTotalRevenue(total);

                const formattedDates = byDate.map((d: any) => ({
                    date: new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                    total: d.total || 0
                }));
                setDailyRevenues(formattedDates);

            } else if (isManager && account?.cinemaId) {
                const cinemaId = account.cinemaId;
                setMycinemaName(account.cinemaName ?? '');

                const [movies, rooms] = await Promise.all([
                    apiClient.movies.getAll().catch(() => []),
                    apiClient.rooms.getByCinema(cinemaId).catch(() => []),
                ]);

                const showtimesByMovie = await Promise.all(
                    movies.map((movie) => apiClient.showtimes.getByMovieAndCinema(movie.id, cinemaId).catch(() => []))
                );
                const allShowtimes = showtimesByMovie.flat();
                const now = new Date();
                const upcoming = allShowtimes
                    .filter((s) => new Date(s.startTime) > now)
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .slice(0, 6);

                setStats({
                    movies: movies.length,
                    cinemas: rooms.length,
                    accounts: 0,
                    showtimes: allShowtimes.length,
                });
                setUpcomingShowtimes(upcoming);

                // Manager can also see daily revenue and top movies for their cinema
                const [byMovie, byDate] = await Promise.all([
                    apiClient.reports.getRevenueByMovie().catch(() => []),
                    apiClient.reports.getRevenueByDate().catch(() => []),
                ]);
                const sorted = [...byMovie].sort((a, b) => (b.total ?? 0) - (a.total ?? 0)).slice(0, 5);
                setTopMovies(sorted);
                
                const total = sorted.reduce((sum: number, c: RevenueByMovie) => sum + (c.total ?? 0), 0);
                setTotalRevenue(total);

                const formattedDates = byDate.map((d: any) => ({
                    date: new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                    total: d.total || 0
                }));
                setDailyRevenues(formattedDates);
            }
        };
        load().catch(() => undefined);
    }, []);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const formatCompactNumber = (number: number) => {
        if (number < 1e3) return number;
        if (number >= 1e3 && number < 1e6) return +(number / 1e3).toFixed(1) + "K";
        if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(1) + "Tr";
        if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(1) + "Tỷ";
        return +(number / 1e12).toFixed(1) + "N";
    };

    const superAdminCards = [
        { title: 'Phim đang quản lý', value: stats.movies, icon: Clapperboard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Rạp đang hoạt động', value: stats.cinemas, icon: MapPin, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { title: 'Tài khoản hệ thống', value: stats.accounts, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { title: 'Suất chiếu đã lên lịch', value: stats.showtimes, icon: Ticket, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    ];

    const managerCards = [
        { title: 'Phim đang chiếu', value: stats.movies, icon: Clapperboard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Phòng chiếu', value: stats.cinemas, icon: MapPin, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { title: 'Suất chiếu đã lên lịch', value: stats.showtimes, icon: Ticket, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-lg shadow-xl">
                    <p className="text-slate-400 text-xs mb-1 font-bold uppercase">{label}</p>
                    <p className="text-blue-400 font-black text-sm">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 bg-[#0A0A0A] min-h-screen p-2 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase italic">
                        {isSuperAdmin ? 'Hệ Thống ' : 'Rạp '}
                        <span className="text-blue-600">{isSuperAdmin ? 'Vận Hành' : mycinemaName}</span>
                    </h1>
                    <p className="mt-1 text-slate-400 text-sm">
                        {isSuperAdmin
                            ? 'Cập nhật dữ liệu thời gian thực từ toàn bộ hệ thống rạp.'
                            : `Dữ liệu vận hành của rạp ${mycinemaName}.`}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Hệ thống ổn định</span>
                </div>
            </div>

            {/* Stats cards */}
            <div className={`grid gap-6 ${isSuperAdmin ? 'sm:grid-cols-2 lg:grid-cols-5' : 'sm:grid-cols-4'}`}>
                {(isSuperAdmin ? superAdminCards : managerCards).map((card) => (
                    <Card key={card.title} className="bg-[#141414] border-white/5 hover:border-blue-500/50 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${card.bg}`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                    {isSuperAdmin ? 'Hệ thống' : mycinemaName}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black">{card.value}</div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">{card.title}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                {/* Tổng doanh thu */}
                <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30 hover:border-blue-500/60 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <TrendingUp className="h-5 w-5 text-blue-400" />
                            </div>
                            <span className="text-[10px] font-bold text-blue-400 uppercase">{isSuperAdmin ? 'Toàn hệ thống' : mycinemaName}</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-black text-blue-300">{formatCompactNumber(totalRevenue)}</div>
                            <p className="text-xs font-medium text-blue-400/70 uppercase tracking-tight">Tổng doanh thu</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main content */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left panel: Chart */}
                <Card className="bg-[#141414] border-white/5 lg:col-span-2 overflow-hidden">
                    <div className="border-b border-white/5 px-6 py-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Biểu đồ doanh thu</h2>
                            <p className="text-xs text-slate-400 mt-1">Doanh thu theo thời gian của {isSuperAdmin ? 'toàn hệ thống' : 'rạp'}.</p>
                        </div>
                        <button className="text-blue-500 hover:text-blue-400 transition-colors">
                            <ArrowUpRight size={20} />
                        </button>
                    </div>
                    <CardContent className="p-6">
                        {dailyRevenues.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dailyRevenues} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#64748b" 
                                            fontSize={12} 
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis 
                                            stroke="#64748b" 
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => formatCompactNumber(value)}
                                            dx={-10}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="total" 
                                            stroke="#3b82f6" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorTotal)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-slate-500 italic">
                                Chưa có dữ liệu doanh thu
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right sidebar */}
                <Card className="bg-[#141414] border-white/5 overflow-hidden">
                    <div className="border-b border-white/5 px-6 py-5">
                        <h2 className="text-lg font-bold">
                            {isSuperAdmin ? 'Doanh thu theo rạp' : 'Phim doanh thu cao nhất'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            {isSuperAdmin ? 'Top rạp doanh thu cao nhất.' : 'Top phim mang lại doanh thu.'}
                        </p>
                    </div>
                    <CardContent className="p-0">
                        {isSuperAdmin ? (
                            cinemaRevenues.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {cinemaRevenues.map((item, i) => {
                                        const max = cinemaRevenues[0]?.total || 1;
                                        const pct = Math.round((item.total / max) * 100);
                                        return (
                                            <div key={i} className="px-6 py-4 hover:bg-white/[0.01]">
                                                <div className="flex justify-between mb-1.5">
                                                    <p className="text-sm font-bold text-slate-200 truncate max-w-[60%]">{item.cinemaName}</p>
                                                    <p className="text-xs font-black text-blue-400">{formatCurrency(item.total)}</p>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-500 italic">Chưa có dữ liệu.</div>
                            )
                        ) : (
                            topMovies.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {topMovies.map((item, i) => (
                                        <div key={i} className="px-6 py-4 hover:bg-white/[0.01] transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-bold text-slate-200 text-sm">{item.movieTitle}</p>
                                            </div>
                                            <p className="font-black text-blue-400">{formatCurrency(item.total)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-500 italic">Chưa có dữ liệu.</div>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {/* Bottom Section: Top Movies (SuperAdmin) or Upcoming (Manager) */}
            <div className="grid gap-6">
                <Card className="bg-[#141414] border-white/5 overflow-hidden">
                    <div className="border-b border-white/5 px-6 py-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">
                                {isSuperAdmin ? 'Phim doanh thu cao nhất' : 'Suất chiếu sắp tới'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                {isSuperAdmin ? 'Top 5 phim có doanh thu lớn nhất hệ thống.' : `Lịch chiếu tại rạp ${mycinemaName}.`}
                            </p>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        {isSuperAdmin ? (
                            topMovies.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/5">
                                    {topMovies.map((item, i) => (
                                        <div key={i} className="px-6 py-5 hover:bg-white/[0.02] transition-colors">
                                            <span className={`text-xl font-black block mb-2 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                                                #{i + 1}
                                            </span>
                                            <p className="font-bold text-slate-200 mb-2 truncate">{item.movieTitle}</p>
                                            <p className="font-black text-blue-400">{formatCurrency(item.total)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-500 italic">Chưa có dữ liệu doanh thu.</div>
                            )
                        ) : (
                            upcomingShowtimes.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {upcomingShowtimes.map((showtime) => (
                                        <div key={showtime.id} className="px-6 py-4 hover:bg-white/[0.01] transition-colors">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-blue-100">{showtime.movie?.title ?? 'Suất chiếu'}</p>
                                                <span className="flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-[11px] font-black text-blue-500">
                                                    <CalendarDays className="h-3 w-3" />
                                                    {new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <MapPin size={11} className="text-blue-600" />
                                                {showtime.room?.name ?? 'Phòng chiếu'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-500 italic">Lịch trình đang trống.</div>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};