import React, { useState } from 'react';
import { login } from '../api/authApi';
import { Link, useNavigate } from 'react-router-dom'; // Đảm bảo import đầy đủ
import { Loader2, Film, Mail, Lock } from 'lucide-react';
import { hasAdminRole, setStoredAccount } from '../utils/session';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 1. Khởi tạo navigate
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(email, password);
            if (response.token) {
                localStorage.setItem('accessToken', response.token);
            }
            localStorage.setItem('currentUser', response.user);
            setStoredAccount(response.account);
            navigate(hasAdminRole(response.token) ? '/admin' : '/');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')] bg-cover bg-center relative">
            {/* Overlay làm tối nền */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>

            <div className="relative max-w-md w-full mx-4">
                <div className="bg-gray-900/85 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 ring-1 ring-white/5">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-500/40 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <Film size={32} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">HUST <span className="text-red-500 italic">CINEMA</span></h2>
                        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-medium">Hệ thống đặt vé sinh viên</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 ml-1 uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="admin@hust.edu.vn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 ml-1 uppercase">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center shadow-lg shadow-red-600/20 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Đăng Nhập'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-sm">
                            Chưa có tài khoản? <Link to="/register" className="text-red-500 font-bold hover:text-red-400 transition-colors ml-1">Đăng ký ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
