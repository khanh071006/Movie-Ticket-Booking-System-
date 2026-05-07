import { useEffect, useState } from 'react';
import { Clapperboard, MapPin, Ticket, Users } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import { Card, CardContent } from '../../components/ui/Card';

export const DashboardPage = () => {
    const [stats, setStats] = useState({ movies: 0, cinemas: 0, accounts: 0, showtimes: 0 });

    useEffect(() => {
        const load = async () => {
            const [movies, cinemas, accounts] = await Promise.all([apiClient.movies.getAll(), apiClient.cinemas.getAll(), apiClient.accounts.getAll()]);
            const showtimesByMovie = await Promise.all(movies.map((movie) => apiClient.showtimes.getByMovie(movie.id).catch(() => [])));
            setStats({
                movies: movies.length,
                cinemas: cinemas.length,
                accounts: accounts.length,
                showtimes: showtimesByMovie.reduce((acc, list) => acc + list.length, 0),
            });
        };
        load().catch(() => undefined);
    }, []);

    const cards = [
        { title: 'Total Movies', value: stats.movies, icon: Clapperboard, color: 'text-blue-600 bg-blue-50' },
        { title: 'Total Cinemas', value: stats.cinemas, icon: MapPin, color: 'text-emerald-600 bg-emerald-50' },
        { title: 'Registered Accounts', value: stats.accounts, icon: Users, color: 'text-purple-600 bg-purple-50' },
        { title: 'Scheduled Showtimes', value: stats.showtimes, icon: Ticket, color: 'text-amber-600 bg-amber-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="mt-2 text-slate-500">Tổng quan realtime từ các API quản trị đã triển khai.</p>
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
        </div>
    );
};
