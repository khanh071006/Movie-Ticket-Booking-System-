import { Link, useNavigate } from 'react-router-dom';
import { Film, LayoutDashboard, LogOut, Menu, ShieldUser, Users } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { clearSession, getStoredUser } from '../features/auth/utils/session';
import { Outlet } from 'react-router-dom';

export const AdminLayout = ({ children }: { children?: ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const currentUser = getStoredUser() || 'Admin';

    const handleLogout = () => {
        clearSession();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <aside className={`fixed left-0 top-0 h-screen border-r border-white/10 bg-[#1A1A1A] p-4 transition-all ${collapsed ? 'w-20' : 'w-64'}`}>
                <div className="mb-8 flex items-center justify-between">
                    <span className={`text-sm font-bold text-[#E50914] ${collapsed ? 'hidden' : 'inline'}`}>MOVIE-APP</span>
                    <button type="button" className="rounded-lg border border-white/10 p-2 hover:bg-white/10" onClick={() => setCollapsed((v) => !v)}>
                        <Menu size={16} />
                    </button>
                </div>
                <nav className="space-y-2 text-sm">
                    <Link to="/admin/accounts" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10">
                        <Users size={16} /> {!collapsed && 'Quản lý tài khoản'}
                    </Link>
                    <Link to="/admin/movies" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10">
                        <Film size={16} /> {!collapsed && 'Quản lý phim'}
                    </Link>
                    <Link to="/admin" className="flex items-center gap-3 rounded-lg bg-[#E50914]/20 px-3 py-2 text-[#E50914]">
                        <LayoutDashboard size={16} /> {!collapsed && 'Thống kê'}
                    </Link>
                </nav>
            </aside>

            <div className={`transition-all ${collapsed ? 'ml-20' : 'ml-64'}`}>
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#0A0A0A]/80 px-4 backdrop-blur-md md:px-8">
                    <p className="text-sm text-[#A3A3A3]">Admin</p>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm">
                            <ShieldUser size={14} /> {currentUser}
                        </span>
                        <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg bg-[#E50914] px-3 py-1.5 text-sm font-semibold hover:bg-[#c50711]">
                            <LogOut size={14} /> Đăng xuất
                        </button>
                    </div>
                </header>
                <main className="p-4 md:p-8">{children ?? <Outlet />}</main>
            </div>
        </div>
    );
};
