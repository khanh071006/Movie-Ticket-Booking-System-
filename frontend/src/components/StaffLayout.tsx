import { CalendarDays, Clapperboard, Film, LogOut, MonitorPlay, QrCode } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearSession, getStoredAccount } from '../features/auth/utils/session';

const navItems = [
    { name: 'Soát vé', path: '/staff/scan-ticket', icon: QrCode },
    { name: 'Phim', path: '/staff/movies', icon: Clapperboard },
    { name: 'Phòng chiếu', path: '/staff/rooms', icon: MonitorPlay },
    { name: 'Lịch chiếu', path: '/staff/showtimes', icon: CalendarDays },
];

export const StaffLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const account = getStoredAccount();

    const handleLogout = () => {
        clearSession();
        navigate('/');
    };

    const filteredNavItems = navItems;

    return (
        /* H-screen để cố định chiều cao layout bằng màn hình, overflow-hidden để chặn cuộn toàn trang */
        <div className="flex h-screen w-full bg-[#0A0A0A] text-slate-200 overflow-hidden">

            {/* SIDEBAR: Sticky/Fixed structure */}
            <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/5 bg-[#0F0F0F] md:flex h-full">
                {/* 1. Fixed Header trong Sidebar */}
                <div className="flex h-16 items-center border-b border-white/5 px-6 flex-shrink-0">
                    <Link to="/" className="group flex items-center gap-2">
                        <div className="rounded-lg bg-blue-600 p-1.5 shadow-lg shadow-blue-900/20">
                            <Film className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold tracking-tight text-white italic">HUSTheatre</span>
                        <span className="ml-2 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 border border-blue-500/20">
                            Nhân viên
                        </span>
                    </Link>
                </div>

                {/* 2. Scrollable Menu: flex-1 kết hợp overflow-y-auto giúp phần này tự cuộn nếu menu quá dài */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6 custom-scrollbar">
                    {filteredNavItems.map((item) => {
                        const active = location.pathname === item.path || (item.path !== '/staff' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                                    active
                                        ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20 shadow-[0_0_15px_-5px_rgba(37,99,235,0.2)]'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <item.icon className={`h-4 w-4 ${active ? 'text-blue-500' : 'text-slate-500'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* 3. Fixed Footer trong Sidebar: Luôn nằm dưới cùng bất kể nội dung trang chính dài bao nhiêu */}
                <div className="flex-shrink-0 border-t border-white/5 bg-black/20 p-4 pb-6">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-sm font-bold text-white shadow-lg border border-white/10">
                            {account?.fullName?.charAt(0).toUpperCase() ?? 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-bold text-white">{account?.fullName ?? 'Quản trị viên'}</p>
                            <p className="truncate text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{account?.email ?? 'admin@gmail.com'}</p>
                            {account?.cinemaName && (
                                <span className="text-xs text-slate-400 block mt-0.5 font-medium border border-slate-700 rounded px-2 py-0.5 bg-slate-800">
                                    {account.cinemaName}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="group flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Trở về trang chủ
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT: Có thanh cuộn riêng */}
            <main className="min-w-0 flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header (chỉ hiện trên màn hình nhỏ) */}
                <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0F0F0F] px-4 flex-shrink-0 md:hidden">
                    <span className="font-bold text-white uppercase text-xs tracking-widest italic">HUSTheatre Admin</span>
                    <button type="button" onClick={handleLogout} className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded">
                        Thoát
                    </button>
                </header>

                {/* Nội dung chính sẽ cuộn tại đây */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar bg-[#0A0A0A]">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};