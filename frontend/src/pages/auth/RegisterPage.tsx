import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Loader2, Mail, Lock, User, Phone, EyeOff, Eye, ShieldCheck } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';

export const RegisterPage = () => {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
    const [otpCode, setOtpCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isOtpMode, setIsOtpMode] = useState(false);
    const navigate = useNavigate();

    const setField =
        (key: keyof typeof form) =>
        (event: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, [key]: event.target.value }));

    const handleRegisterSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await apiClient.auth.register({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                phone: form.phone.trim() ? form.phone : undefined,
            });
            setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.');
            setIsOtpMode(true);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await apiClient.auth.verifyOtp(form.email, otpCode);
            setSuccess('Xác thực thành công, đang chuyển tới đăng nhập...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(parseError(err));
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
                            {isOtpMode ? <ShieldCheck className="h-8 w-8" /> : <Film className="h-8 w-8" />}
                        </div>
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
                            {isOtpMode ? 'Xác thực tài khoản' : 'Tạo tài khoản mới'}
                        </h1>
                        <p className="text-sm text-gray-400">
                            {isOtpMode ? `Nhập mã 6 số được gửi tới ${form.email}` : 'Đăng ký để đặt vé và theo dõi lịch chiếu.'}
                        </p>
                    </div>

                    {!isOtpMode ? (
                        <form onSubmit={handleRegisterSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Họ và tên</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Nguyễn Văn A"
                                        value={form.fullName}
                                        onChange={setField('fullName')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500"
                                        type="email"
                                        placeholder="nhap@email.com"
                                        value={form.email}
                                        onChange={setField('email')}
                                        required
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
                                        value={form.password}
                                        onChange={setField('password')}
                                        required
                                        minLength={6}
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

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Số điện thoại <span className="text-gray-500">(tuỳ chọn)</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500"
                                        placeholder="0123456789"
                                        value={form.phone}
                                        onChange={setField('phone')}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Đăng ký'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Mã OTP (6 chữ số)</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-center text-2xl tracking-widest text-white placeholder-gray-600 outline-none transition-all focus:border-blue-500 focus:bg-white/10 focus:ring-1 focus:ring-blue-500"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || otpCode.length !== 6}
                                className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Xác thực'}
                            </button>
                        </form>
                    )}

                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-transparent px-2 text-gray-500">Hoặc</span>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="font-semibold text-blue-400 transition-colors hover:text-blue-300">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
