import { Bell, ChevronDown, Search, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearSession, getStoredToken, getStoredAccount, getStoredUser, hasBackofficeAccess, hasSuperAdminRole, hasManagerRole, hasStaffRole } from '../features/auth/utils/session';

interface AppBarProps {
    showSearch?: boolean;
    onSearchChange?: (value: string) => void;
}

export const AppBar = ({ showSearch = true, onSearchChange }: AppBarProps) => {
    const token = getStoredToken();
    const isLoggedIn = Boolean(token);
    const isBackoffice = hasBackofficeAccess(token);
    const currentAccount = getStoredAccount();
    const storedUser = getStoredUser();
    const displayName = currentAccount?.fullName || storedUser || 'Khách hàng';
    const displayEmail = currentAccount?.email || '';
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearSession();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-8">
                <div className="flex items-center gap-5">
                    <Link to="/" className="text-lg font-black tracking-tight text-[#E50914]">MOVIE-APP</Link>
                    <nav className="hidden md:flex items-center gap-4 text-sm">
                        <Link to="/movies" className={location.pathname.startsWith('/movies') ? 'text-white' : 'text-[#A3A3A3] hover:text-white'}>Phim</Link>
                        <Link to="/" className={location.pathname === '/' ? 'text-white' : 'text-[#A3A3A3] hover:text-white'}>Trang chủ</Link>
                    </nav>
                </div>

                <div className="flex-1 flex justify-center">
                    {showSearch && (
                        <div className="relative w-full max-w-md">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
                            <input
                                type="text"
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                placeholder="Tìm phim..."
                                className="w-full rounded-full border border-white/10 bg-[#1A1A1A] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[#E50914]"
                            />
                        </div>
                    )}
                </div>

                {!isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="rounded-lg border border-[#E50914] px-3 py-1.5 text-sm text-[#E50914] hover:bg-[#E50914]/10">Đăng nhập</Link>
                        <Link to="/register" className="rounded-lg bg-[#E50914] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#c50711]">Đăng ký</Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        {isBackoffice && (
                            <button onClick={() => {
                                if (hasSuperAdminRole(token)) navigate('/superadmin');
                                else if (hasManagerRole(token)) navigate('/manager');
                                else if (hasStaffRole(token)) navigate('/staff');
                            }} className="rounded-lg bg-[#E50914] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#c50711]">
                                Trang quản trị
                            </button>
                        )}
                        <button type="button" className="rounded-lg border border-white/10 p-2 text-[#A3A3A3] hover:text-white">
                            <Bell size={16} />
                        </button>
                        
                        <div className="relative group">
                            <div className="cursor-pointer flex items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1A] p-1 pr-3 text-sm transition hover:bg-white/5">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#E50914] to-red-800 text-sm font-bold text-white shadow-sm border border-white/10">
                                    {displayName === 'Khách hàng' ? <User size={16} /> : displayName.slice(0, 1).toUpperCase()}
                                </span>
                                <span className="hidden md:inline font-medium text-slate-200">{displayName}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </div>
                            
                            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-56 z-50">
                                <div className="rounded-xl border border-white/10 bg-[#1A1A1A] p-1 shadow-2xl backdrop-blur-xl">
                                    <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                                        <p className="text-sm font-bold text-white line-clamp-1">{displayName}</p>
                                        {displayEmail && <p className="text-xs text-slate-400 line-clamp-1">{displayEmail}</p>}
                                    </div>
                                    <Link to="/movies" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition">Phim</Link>
                                    <button type="button" onClick={handleLogout} className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 transition">
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
