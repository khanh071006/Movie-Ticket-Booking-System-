import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, QrCode, Home, Film } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const PaymentReturnPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('Đang xác thực thanh toán...');

    useEffect(() => {
        const verify = async () => {
            try {
                // Lấy toàn bộ query params
                const params: Record<string, string> = {};
                for (const [key, value] of searchParams.entries()) {
                    params[key] = value;
                }

                // Call backend để verify (dùng http instance để bypass các logic nếu cần)
                // Hoặc dùng apiClient nhưng endpoint không có auth
                const queryStr = new URLSearchParams(params).toString();
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1/payments/vnpay/verify?${queryStr}`);
                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Vé của bạn đã được xác nhận.');
                } else {
                    setStatus('failed');
                    setMessage(data.message || 'Thanh toán thất bại hoặc bị huỷ.');
                }
            } catch (err) {
                setStatus('failed');
                setMessage('Có lỗi xảy ra trong quá trình xác thực.');
            }
        };

        if (searchParams.has('vnp_SecureHash')) {
            verify();
        } else {
            setStatus('failed');
            setMessage('Tham số xác thực không hợp lệ.');
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className={`absolute top-1/4 left-1/4 w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-20 ${status === 'success' ? 'bg-emerald-500' : status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className={`absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-20 ${status === 'success' ? 'bg-emerald-500' : status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} />
            </div>

            <Card className="w-full max-w-lg mx-4 bg-[#121212]/90 border-white/10 backdrop-blur-md p-8 sm:p-12 text-center shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-6 py-8">
                        <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                        <h2 className="text-xl font-black text-blue-400 uppercase tracking-widest">{message}</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30 animate-in zoom-in-50 duration-500 delay-150">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">{message}</h2>
                        
                        <div className="bg-white p-6 rounded-2xl shadow-xl mt-4">
                            <QrCode className="w-48 h-48 text-black" />
                            <p className="text-black font-black mt-2 text-sm uppercase tracking-widest text-center">VÉ CỦA BẠN</p>
                        </div>
                        <p className="text-slate-400 text-sm italic mb-4">Vui lòng đưa mã QR này cho nhân viên soát vé tại rạp.</p>

                        <div className="flex gap-4 w-full">
                            <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold" onClick={() => navigate('/')}>
                                <Home size={18} className="mr-2" /> VỀ TRANG CHỦ
                            </Button>
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]" onClick={() => navigate('/movies')}>
                                <Film size={18} className="mr-2" /> ĐẶT VÉ TIẾP
                            </Button>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] border border-red-500/30 animate-in zoom-in-50 duration-500 delay-150">
                            <XCircle className="w-12 h-12 text-red-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-red-400 uppercase tracking-wider">THANH TOÁN THẤT BẠI</h2>
                        <p className="text-slate-300 mb-6">{message}</p>
                        
                        <Button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 text-lg" onClick={() => navigate('/')}>
                            QUAY LẠI TRANG CHỦ
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};
