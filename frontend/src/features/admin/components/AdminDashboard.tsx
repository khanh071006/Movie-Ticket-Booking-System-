import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Film, ShieldUser, Users, LogOut, Loader2 } from 'lucide-react';
import { getMovies } from '../../movies/api/movieApi';
import { clearSession } from '../../auth/utils/session';

interface ApiResponse<T> {
    data: T;
}

interface AccountSummary {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    roles?: string[];
}

const adminApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const AdminDashboard = () => {
    const [movieCount, setMovieCount] = useState(0);
    const [accountCount, setAccountCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('currentUser') ?? 'Admin';

    useEffect(() => {
        const loadDashboard = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const [movies, accountResponse] = await Promise.all([
                    getMovies(),
                    adminApi.get<ApiResponse<AccountSummary[]>>('/accounts', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);

                setMovieCount(movies.length);
                setAccountCount(accountResponse.data.data.length);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu dashboard.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);

    const handleLogout = () => {
        clearSession();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
                <Loader2 className="animate-spin text-red-500" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1115] text-white p-8">
            <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-red-500 tracking-tight flex items-center gap-2">
                        <ShieldUser /> ADMIN DASHBOARD
                    </h1>
                    <p className="text-gray-400 mt-1">Xin chào, {currentUser}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
                >
                    <LogOut size={16} /> Đăng xuất
                </button>
            </header>

            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-red-300">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Tổng số phim</p>
                    <div className="flex items-center gap-3 text-3xl font-bold text-red-400">
                        <Film size={28} /> {movieCount}
                    </div>
                </div>

                <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Tổng số tài khoản</p>
                    <div className="flex items-center gap-3 text-3xl font-bold text-blue-400">
                        <Users size={28} /> {accountCount}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
                <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition"
                >
                    <ShieldUser size={18} /> Hồ sơ của tôi
                </Link>
                <Link
                    to="/movies"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition"
                >
                    <Film size={18} /> Xem trang danh sách phim
                </Link>
            </div>
        </div>
    );
};
