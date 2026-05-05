import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Film, LogOut, ShieldUser, UserCircle2 } from 'lucide-react';
import {
    clearSession,
    getRolesFromToken,
    getStoredAccount,
    getStoredToken,
    getStoredUser,
    type SessionAccount,
} from '../../auth/utils/session';

interface ApiResponse<T> {
    data: T;
}

interface AccountApiResponse {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
}

const profileApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ProfilePage = () => {
    const navigate = useNavigate();
    const token = getStoredToken();
    const roles = getRolesFromToken(token);
    const [account, setAccount] = useState<SessionAccount | null>(getStoredAccount());

    useEffect(() => {
        const loadProfile = async () => {
            if (!token) {
                navigate('/login');
                return;
            }

            const stored = getStoredAccount();
            if (!stored?.id) {
                return;
            }

            try {
                const response = await profileApi.get<ApiResponse<AccountApiResponse>>(`/accounts/${stored.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const apiAccount = response.data.data;
                const merged = {
                    id: apiAccount.id,
                    email: apiAccount.email,
                    fullName: apiAccount.fullName,
                    phone: apiAccount.phone,
                };
                setAccount(merged);
                localStorage.setItem('currentAccount', JSON.stringify(merged));
            } catch {
                // User thường không có quyền /accounts/{id}; giữ nguyên dữ liệu local từ login.
            }
        };

        loadProfile();
    }, [navigate, token]);

    const handleLogout = () => {
        clearSession();
        navigate('/login');
    };

    const displayName = account?.fullName || getStoredUser() || 'Người dùng';
    const displayEmail = account?.email || 'Không có dữ liệu email';

    return (
        <div className="min-h-screen bg-[#0f1115] text-white p-8">
            <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-black text-red-500 tracking-tight flex items-center gap-2">
                    <UserCircle2 /> THÔNG TIN TÀI KHOẢN
                </h1>
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
                >
                    <LogOut size={16} /> Đăng xuất
                </button>
            </header>

            <div className="max-w-2xl bg-gray-900/70 border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Họ tên</p>
                    <p className="text-lg font-semibold">{displayName}</p>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Email</p>
                    <p className="text-lg">{displayEmail}</p>
                </div>
                {account?.phone && (
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Số điện thoại</p>
                        <p className="text-lg">{account.phone}</p>
                    </div>
                )}
                {account?.id && (
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Account ID</p>
                        <p className="text-sm break-all text-gray-300">{account.id}</p>
                    </div>
                )}
                <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Vai trò</p>
                    <div className="flex flex-wrap gap-2">
                        {roles.length > 0 ? roles.map((role) => (
                            <span key={role} className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg text-sm">
                                <ShieldUser size={14} /> {role}
                            </span>
                        )) : <span className="text-gray-300">Không có dữ liệu vai trò</span>}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Link to="/movies" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition">
                    <Film size={18} /> Quay lại danh sách phim
                </Link>
            </div>
        </div>
    );
};
