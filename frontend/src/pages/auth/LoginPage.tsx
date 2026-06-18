import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../../api/authApi';
import { setStoredAccount, setStoredToken, hasSuperAdminRole, hasManagerRole, hasStaffRole } from '../../features/auth/utils/session';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { token, account } = await login(email, password);
            if (token) setStoredToken(token);
            setStoredAccount(account);
            if (hasSuperAdminRole(token)) navigate('/superadmin');
            else if (hasManagerRole(token)) navigate('/manager');
            else if (hasStaffRole(token)) navigate('/staff');
            else navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
                <div className="absolute -right-10 -top-10 p-4 opacity-5">
                    <Film className="h-48 w-48 text-white" />
                </div>
                <div className="absolute -left-10 -bottom-10 p-4 opacity-5">
                    <Film className="h-40 w-40 text-white" />
                </div>

                <div className="relative z-10">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-blue-500">
                            <Film className="h-8 w-8" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Chào mừng quay lại</h1>
                        <p className="text-sm text-gray-400">Đăng nhập để tiếp tục với tài khoản của bạn</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500"
                                    type="email"
                                    placeholder="nhap@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-transparent px-2 text-gray-500">Hoặc</span>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="font-semibold text-blue-400 transition-colors hover:text-blue-300">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
