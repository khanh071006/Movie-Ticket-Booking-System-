import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Loader2, Mail, Lock } from 'lucide-react';
import { login } from '../../api/authApi';
import { hasAdminRole, setStoredAccount, setStoredToken } from '../../features/auth/utils/session';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            navigate(hasAdminRole(token) ? '/admin' : '/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md py-16">
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Film className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-2xl font-bold tracking-tight">Chào mừng quay lại</h1>
                        <p className="text-sm text-slate-500">Đăng nhập để truy cập hệ thống đặt vé.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="h-10 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </label>
                        <label className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu</span>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="h-10 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </label>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex h-10 w-full items-center justify-center rounded-md bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Đăng nhập'}
                        </button>
                        {error && <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                    </form>
                    <p className="mt-5 text-center text-sm text-slate-500">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
