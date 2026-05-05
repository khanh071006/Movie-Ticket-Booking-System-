import { Bell, ChevronDown, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearSession, getStoredToken, getStoredUser, hasAdminRole } from '../features/auth/utils/session';

interface AppBarProps {
    showSearch?: boolean;
    onSearchChange?: (value: string) => void;
}

export const AppBar = ({ showSearch = true, onSearchChange }: AppBarProps) => {
    const token = getStoredToken();
    const isLoggedIn = Boolean(token);
    const isAdmin = hasAdminRole(token);
    const currentUser = getStoredUser() || 'User';
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
                        {isAdmin && (
                            <Link to="/admin" className="rounded-lg bg-[#E50914] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#c50711]">
                                Dashboard
                            </Link>
                        )}
                        <button type="button" className="rounded-lg border border-white/10 p-2 text-[#A3A3A3] hover:text-white">
                            <Bell size={16} />
                        </button>
                        <details className="relative">
                            <summary className="list-none cursor-pointer">
                                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-1.5 text-sm">
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E50914] text-xs font-bold text-white">
                                        {currentUser.slice(0, 1).toUpperCase()}
                                    </span>
                                    <span className="hidden md:inline">{currentUser}</span>
                                    <ChevronDown size={14} />
                                </span>
                            </summary>
                            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#1A1A1A] p-2 shadow-2xl">
                                <Link to="/movies" className="block rounded-lg px-3 py-2 text-sm text-[#A3A3A3] hover:bg-white/10 hover:text-white">Phim</Link>
                                <button type="button" onClick={handleLogout} className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-[#EF4444] hover:bg-[#EF4444]/10">
                                    Đăng xuất
                                </button>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </header>
    );
};
