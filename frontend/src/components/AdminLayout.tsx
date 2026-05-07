import { CalendarDays, Clapperboard, Film, LayoutDashboard, LogOut, MapPin, MonitorPlay, Tags, Users } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearSession, getStoredAccount } from '../features/auth/utils/session';

const navItems = [
    { name: 'Bảng điều khiển', path: '/admin', icon: LayoutDashboard },
    { name: 'Tài khoản', path: '/admin/accounts', icon: Users },
    { name: 'Phim', path: '/admin/movies', icon: Clapperboard },
    { name: 'Rạp chiếu', path: '/admin/cinemas', icon: MapPin },
    { name: 'Phòng chiếu', path: '/admin/rooms', icon: MonitorPlay },
    { name: 'Lịch chiếu', path: '/admin/showtimes', icon: CalendarDays },
    { name: 'Danh mục', path: '/admin/categories', icon: Tags },
];

export const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const account = getStoredAccount();

    const handleLogout = () => {
        clearSession();
        navigate('/');
    };

    return (
        /* Đổi sang nền đen sâu cho toàn bộ trang quản trị */
        <div className="flex min-h-screen bg-[#0A0A0A] text-slate-200">
            {/* Sidebar: Chuyển sang Dark Gray và Border mờ */}
            <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/5 bg-[#0F0F0F] md:flex">
                <div className="flex h-16 items-center border-b border-white/5 px-6">
                    <Link to="/" className="group flex items-center gap-2">
                        <div className="rounded-lg bg-blue-600 p-1.5 shadow-lg shadow-blue-900/20">
                            <Film className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold tracking-tight text-white">HUSTheatre</span>
                        <span className="ml-2 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 border border-blue-500/20">Quản trị</span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
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

                {/* Phần thông tin User ở Sidebar bottom */}
                <div className="border-t border-white/5 bg-black/20 p-4 pb-6">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-sm font-bold text-white shadow-lg">
                            {account?.fullName?.charAt(0).toUpperCase() ?? 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-semibold text-white">{account?.fullName ?? 'Quản trị viên'}</p>
                            <p className="truncate text-[10px] text-slate-500 uppercase tracking-tighter">{account?.email ?? 'Chưa có email'}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-start gap-2 rounded-lg px-2 py-2 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Trở về trang chủ
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="min-w-0 flex-1 overflow-hidden flex flex-col">
                <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0F0F0F] px-4 md:hidden">
                    <span className="font-bold text-white uppercase text-xs tracking-widest">Quản trị viên</span>
                    <button type="button" onClick={handleLogout} className="text-xs font-bold text-blue-500">
                        Thoát
                    </button>
                </header>

                {/* Content scrollable area */}
                <div className="h-full overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
                    <div className="mx-auto max-w-6xl">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};