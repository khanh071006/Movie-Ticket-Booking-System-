import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockSignup } from '../api/authApi';
import { Loader2, Film, Mail, Lock, User, CheckCircle } from 'lucide-react';

export const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await mockSignup(name, email, password);
            alert("Đăng ký thành công!");
            navigate('/login'); // Đăng ký xong cho sang login
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

            <div className="relative max-w-md w-full mx-4">
                <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-white tracking-tighter italic">JOIN THE <span className="text-red-500">CLUB</span></h2>
                        <p className="text-gray-400 text-sm mt-1">Tạo tài khoản để nhận nhiều ưu đãi đặt vé</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text" required
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none transition-all"
                                placeholder="Họ và tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email" required
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none transition-all"
                                placeholder="Email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password" required
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 outline-none transition-all"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-white text-black hover:bg-red-600 hover:text-white font-bold py-3.5 rounded-xl transition-all flex justify-center items-center shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Tạo Tài Khoản'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-gray-400 text-sm">
                        Đã có tài khoản? <Link to="/login" className="text-red-500 font-bold hover:underline">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};