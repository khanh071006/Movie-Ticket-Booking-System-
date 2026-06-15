import { Gift, Ticket, Award, Star, Compass, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getStoredToken } from '../../features/auth/utils/session';

export const PromotionsPage = () => {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(getStoredToken());

    const promotions = [
        {
            id: 'promo-1',
            title: 'Ưu đãi Đăng Ký Mới',
            tag: 'Welcome Gift',
            description: 'Giảm ngay 20% cho giao dịch đặt vé trực tuyến đầu tiên sau khi đăng ký tài khoản thành công.',
            icon: Ticket,
            color: 'from-blue-600 to-cyan-500',
            badge: 'Mới'
        },
        {
            id: 'promo-2',
            title: 'Ngày Hội Thành Viên HUS',
            tag: 'Member Day',
            description: 'Đồng giá vé 45k áp dụng cho tất cả các suất chiếu 2D vào ngày Thứ Ba cuối cùng mỗi tháng.',
            icon: Sparkles,
            color: 'from-purple-600 to-pink-500',
            badge: 'Hàng Tháng'
        },
        {
            id: 'promo-3',
            title: 'Sinh Nhật Trọn Vẹn',
            tag: 'Birthday Special',
            description: 'Tặng ngay 1 Combo Bỏng nước cỡ lớn (L) miễn phí trong suốt tháng sinh nhật của thành viên.',
            icon: Gift,
            color: 'from-amber-500 to-red-500',
            badge: 'Sinh Nhật'
        },
        {
            id: 'promo-4',
            title: 'Tích Lũy Điểm Thượng Hạng',
            tag: 'HUSPoints',
            description: 'Tích lũy 5% giá trị giao dịch cho thành viên Standard và lên tới 10% cho thành viên VIP để đổi vé miễn phí.',
            icon: Award,
            color: 'from-emerald-600 to-teal-500',
            badge: 'Trọn Đời'
        }
    ];

    const tiers = [
        {
            name: 'Standard',
            price: 'Miễn phí đăng ký',
            description: 'Dành cho tất cả khách hàng đăng ký tài khoản HUSTheatre.',
            features: [
                'Tích lũy điểm thưởng 5% giá trị giao dịch',
                'Quà tặng sinh nhật (Combo Solo bỏng nước)',
                'Ưu tiên nhận thông tin khuyến mãi sớm nhất',
                'Đồng giá vé 45k vào Ngày Hội Thành Viên'
            ],
            color: 'border-slate-800 bg-zinc-900/30'
        },
        {
            name: 'Gold Member',
            price: 'Chi tiêu từ 2.000.000đ',
            description: 'Tự động nâng hạng khi chi tiêu tích lũy đạt mốc trong năm.',
            features: [
                'Tích lũy điểm thưởng 8% giá trị giao dịch',
                'Quà tặng sinh nhật (Combo Couple bỏng nước)',
                'Miễn phí đổi vé và hoàn tiền trước giờ chiếu 1 tiếng',
                'Giảm 10% khi mua đồ ăn nước uống tại quầy bắp nước'
            ],
            color: 'border-amber-500/30 bg-amber-950/10 shadow-lg shadow-amber-500/5',
            featured: true
        },
        {
            name: 'Diamond VIP',
            price: 'Chi tiêu từ 5.000.000đ',
            description: 'Hạng VIP cao quý nhất với những quyền lợi độc quyền tối cao.',
            features: [
                'Tích lũy điểm thưởng 10% giá trị giao dịch',
                'Quà tặng sinh nhật đặc biệt và quà Tết VIP',
                'Quầy phục vụ check-in riêng không cần xếp hàng',
                'Giảm 20% khi mua đồ ăn bắp nước tại quầy',
                'Trải nghiệm phòng chiếu Giường nằm IMAX miễn phí 2 lần/năm'
            ],
            color: 'border-blue-500/30 bg-blue-950/10 shadow-lg shadow-blue-500/5'
        }
    ];

    const handleTierClick = (tierName: string) => {
        if (!isLoggedIn) {
            navigate('/register');
        } else {
            if (tierName === 'Standard') {
                alert('Tài khoản của bạn hiện tại đã là Standard.');
            } else {
                alert(`Bạn đang ở hạng thành viên Standard. Để nâng cấp lên hạng ${tierName}, vui lòng tích lũy chi tiêu thêm bằng cách đặt vé xem phim tại rạp HUSTheatre!`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 text-white">
            <div className="container mx-auto px-4 lg:px-8">
                
                {/* Hero Section */}
                <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950/30 border border-white/5 p-10 md:p-16 text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">
                            <Star size={12} className="fill-current" />
                            Đặc quyền thành viên HUS
                        </span>
                        <h1 className="text-4xl font-black tracking-tight uppercase italic md:text-6xl">
                            ƯU ĐÃI <span className="text-blue-500">THÀNH VIÊN</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            Đăng ký tài khoản HUSTheatre ngay hôm nay để nhận đặc quyền tích lũy điểm thưởng, 
                            nhận vé xem phim miễn phí cùng hàng ngàn khuyến mãi cực khủng từ cụm rạp của chúng tôi.
                        </p>
                        
                        {!isLoggedIn && (
                            <div className="flex justify-center gap-4 pt-4">
                                <button 
                                    onClick={() => navigate('/register')}
                                    className="h-12 px-8 rounded-xl text-base font-black italic bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/30 text-white active:scale-95 transition-all"
                                >
                                    ĐĂNG KÝ THÀNH VIÊN
                                </button>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="h-12 px-8 rounded-xl text-base font-black italic border border-white/20 bg-transparent text-white hover:bg-white hover:text-zinc-950 active:scale-95 transition-all"
                                >
                                    ĐĂNG NHẬP
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Promotions Cards Grid */}
                <div className="space-y-10 mb-20">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 rounded-full bg-blue-600" />
                        <h2 className="text-2xl font-black tracking-tight uppercase italic">Chương trình <span className="text-blue-600">Khuyến Mãi</span></h2>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        {promotions.map((promo) => {
                            const IconComp = promo.icon;
                            return (
                                <div 
                                    key={promo.id} 
                                    className="group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-950 p-8 transition-all duration-300 hover:border-white/10 hover:-translate-y-1 flex flex-col justify-between"
                                >
                                    <div className={`absolute right-0 top-0 h-32 w-32 bg-gradient-to-br ${promo.color} opacity-[0.03] blur-2xl transition-all duration-300 group-hover:scale-125 group-hover:opacity-10`} />
                                    
                                    <div className="flex gap-6 items-start mb-6">
                                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${promo.color} shadow-lg shadow-blue-900/10`}>
                                            <IconComp className="h-7 w-7 text-white" />
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{promo.tag}</span>
                                                <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-500">{promo.badge}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{promo.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{promo.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="relative z-10 pt-2">
                                        {promo.id === 'promo-1' ? (
                                            <button
                                                onClick={() => {
                                                    if (isLoggedIn) {
                                                        alert('Chào mừng thành viên mới! Tài khoản của bạn đã kích hoạt ưu đãi này cho lần đặt vé đầu tiên.');
                                                    } else {
                                                        navigate('/register');
                                                    }
                                                }}
                                                className="px-5 py-2.5 rounded-xl text-xs font-black italic uppercase transition-all bg-white text-zinc-950 hover:bg-slate-200 active:scale-95 shadow-md"
                                            >
                                                {isLoggedIn ? 'Đã Kích Hoạt' : 'Đăng Ký Nhận Ngay'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate('/movies')}
                                                className="px-5 py-2.5 rounded-xl text-xs font-black italic uppercase transition-all border border-white/20 text-white hover:bg-white hover:text-zinc-950 active:scale-95"
                                            >
                                                Đặt Vé Ngay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Membership Tiers */}
                <div className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 rounded-full bg-blue-600" />
                        <h2 className="text-2xl font-black tracking-tight uppercase italic">Hạng <span className="text-blue-600">Thành Viên</span></h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {tiers.map((tier) => (
                            <div 
                                key={tier.name} 
                                className={`flex flex-col rounded-3xl border p-8 transition-all ${tier.color} ${
                                    tier.featured ? 'scale-105 border-amber-500/50' : 'hover:border-white/10'
                                }`}
                            >
                                {tier.featured && (
                                    <span className="self-start rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-6">
                                        Phổ biến nhất
                                    </span>
                                )}
                                
                                <div className="space-y-2 mb-6">
                                    <h3 className="text-2xl font-black tracking-tight uppercase italic text-white">{tier.name}</h3>
                                    <p className="text-slate-400 text-xs font-semibold">{tier.description}</p>
                                    <p className="text-2xl font-black text-blue-500 pt-2">{tier.price}</p>
                                </div>

                                <div className="h-px w-full bg-white/5 mb-6" />

                                <ul className="space-y-4 flex-1 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                            <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    disabled={isLoggedIn && tier.name === 'Standard'}
                                    className={`w-full h-11 inline-flex items-center justify-center font-black italic rounded-xl transition-all active:scale-95 text-sm ${
                                        isLoggedIn && tier.name === 'Standard'
                                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                                            : tier.featured 
                                                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                                                : 'bg-white text-zinc-950 hover:bg-slate-200 shadow-md'
                                    }`}
                                    onClick={() => handleTierClick(tier.name)}
                                >
                                    {isLoggedIn 
                                        ? (tier.name === 'Standard' ? 'HẠNG HIỆN TẠI' : 'NÂNG HẠNG') 
                                        : 'ĐĂNG KÝ NGAY'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
