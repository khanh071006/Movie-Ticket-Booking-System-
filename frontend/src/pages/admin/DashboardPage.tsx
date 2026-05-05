import { useEffect, useState } from 'react';
import { Film, Users } from 'lucide-react';
import axios from 'axios';
import { getMovies } from '../../features/movies/api/movieApi';
import { getStoredToken } from '../../features/auth/utils/session';

interface ApiResponse<T> {
    data: T;
}

interface AccountSummary {
    id: string;
}

const adminApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
});

export const DashboardPage = () => {
    const [movieCount, setMovieCount] = useState(0);
    const [accountCount, setAccountCount] = useState(0);

    useEffect(() => {
        const load = async () => {
            const token = getStoredToken();
            const [movies, accounts] = await Promise.all([
                getMovies(),
                adminApi.get<ApiResponse<AccountSummary[]>>('/accounts', { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setMovieCount(movies.length);
            setAccountCount(accounts.data.data.length);
        };
        load();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
                <p className="text-sm text-[#A3A3A3]">Tổng số phim</p>
                <div className="mt-2 flex items-center gap-3 text-3xl font-bold text-[#E50914]">
                    <Film size={28} /> {movieCount}
                </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
                <p className="text-sm text-[#A3A3A3]">Tổng số tài khoản</p>
                <div className="mt-2 flex items-center gap-3 text-3xl font-bold text-blue-400">
                    <Users size={28} /> {accountCount}
                </div>
            </div>
        </div>
    );
};
