import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { register } from '../../api/authApi';

export const RegisterPage = () => {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const setField =
        (key: keyof typeof form) =>
        (event: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, [key]: event.target.value }));

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await register({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                phone: form.phone.trim() ? form.phone : undefined,
            });
            setSuccess('Đăng ký thành công, đang chuyển tới đăng nhập...');
            setTimeout(() => navigate('/login'), 900);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng ký thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md py-16">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Tạo tài khoản mới</h1>
                    <p className="mt-1 text-sm text-slate-500">Đăng ký để đặt vé và theo dõi lịch chiếu.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Họ và tên" value={form.fullName} onChange={setField('fullName')} required />
                    <input className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Email" type="email" value={form.email} onChange={setField('email')} required />
                    <input className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Mật khẩu" type="password" value={form.password} onChange={setField('password')} required />
                    <input className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Số điện thoại (tuỳ chọn)" value={form.phone} onChange={setField('phone')} />
                    <button type="submit" disabled={loading} className="flex h-10 w-full items-center justify-center rounded-md bg-blue-600 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Đăng ký'}
                    </button>
                </form>
                {error && <p className="mt-4 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                {success && <p className="mt-4 rounded-md border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
                <p className="mt-5 text-center text-sm text-slate-500">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};
