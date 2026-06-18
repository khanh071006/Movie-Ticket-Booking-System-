import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Film, Menu, X, User, ChevronDown } from 'lucide-react';
import { clearSession, getStoredToken, getStoredAccount, getStoredUser, hasBackofficeAccess, hasSuperAdminRole, hasManagerRole, hasStaffRole } from '../features/auth/utils/session';
import { Button } from './ui/Button';

export const PublicLayout = () => {
    const token = getStoredToken();
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = Boolean(token);
    const isBackoffice = hasBackofficeAccess(token);
    const currentAccount = getStoredAccount();
    const storedUser = getStoredUser();
    const displayName = currentAccount?.fullName || storedUser || 'Khách hàng';
    const displayEmail = currentAccount?.email || '';

    const handleDashboardNavigate = () => {
        if (hasSuperAdminRole(token)) navigate('/superadmin');
        else if (hasManagerRole(token)) navigate('/manager');
        else if (hasStaffRole(token)) navigate('/staff');
    };
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        clearSession();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-slate-50 selection:bg-blue-500/30 font-sans">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-lg">
                <div className="container relative mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="group flex items-center gap-2.5">
                        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg shadow-blue-500/20 transition-shadow group-hover:shadow-blue-500/40">
                            <Film className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white hidden sm:inline-block">
                            HUS<span className="text-blue-500">Theatre</span>
                        </span>
                    </Link>
                    
                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
                            <Link to="/movies" className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${location.pathname === '/movies' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                                Kho Phim
                            </Link>
                            <Link to="/showtimes" className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${location.pathname.startsWith('/showtimes') ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                                Lịch Chiếu
                            </Link>
                            <Link to="/cinemas" className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${location.pathname.startsWith('/cinemas') ? 'bg-white/15 text-white shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                                Rạp Chiếu
                            </Link>

                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="hidden sm:block">
                                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                        Đăng ký
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                {isBackoffice && (
                                    <button onClick={handleDashboardNavigate} className="hidden sm:block">
                                        <Button size="sm" className="border-0 bg-blue-600/20 text-blue-500 hover:bg-blue-600/30">
                                            Quản lý
                                        </Button>
                                    </button>
                                )}
                                
                                {/* User Dropdown */}
                                <div className="relative group">
                                    <div className="cursor-pointer flex items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1A] p-1 pr-3 text-sm transition hover:bg-white/5">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm border border-white/10">
                                            {displayName === 'Khách hàng' ? <User size={16} /> : displayName.slice(0, 1).toUpperCase()}
                                        </span>
                                        <span className="hidden sm:inline font-medium text-slate-200 line-clamp-1 max-w-[100px]">{displayName}</span>
                                        <ChevronDown size={14} className="text-slate-400" />
                                    </div>
                                    
                                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-56 z-50">
                                        <div className="rounded-xl border border-white/10 bg-[#1A1A1A] p-1 shadow-2xl backdrop-blur-xl">
                                            <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                                                <p className="text-sm font-bold text-white line-clamp-1">{displayName}</p>
                                                {displayEmail && <p className="text-xs text-slate-400 line-clamp-1">{displayEmail}</p>}
                                            </div>
                                            {isBackoffice && (
                                                <button onClick={handleDashboardNavigate} className="sm:hidden block w-full text-left rounded-lg px-3 py-2 text-sm text-blue-400 hover:bg-white/10 hover:text-blue-300 transition">
                                                    Trang Quản trị
                                                </button>
                                            )}
                                            <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition mt-1">
                                                Hồ sơ & Đặt vé
                                            </Link>
                                            <button type="button" onClick={handleLogout} className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 transition">
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Mobile Menu Toggle */}
                        <button 
                            className="md:hidden p-2 text-slate-400 hover:text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-lg animate-in slide-in-from-top-4">
                        <nav className="flex flex-col p-4 gap-2">
                            <Link 
                                to="/" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                Trang chủ
                            </Link>
                            <Link 
                                to="/movies" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${location.pathname === '/movies' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                Kho Phim
                            </Link>
                            <Link 
                                to="/showtimes" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${location.pathname.startsWith('/showtimes') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                Lịch Chiếu
                            </Link>
                            <Link 
                                to="/cinemas" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${location.pathname.startsWith('/cinemas') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                Hệ thống rạp
                            </Link>
                            {!isLoggedIn && (
                                <Link 
                                    to="/login" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5"
                                >
                                    Đăng nhập
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </header>
            <main className="min-h-[calc(100vh-4rem-100px)]">
                <Outlet />
            </main>
            <footer className="mt-12 border-t border-white/10 bg-[#0A0A0A] py-12">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                    <div className="flex items-center gap-2 opacity-50">
                        <Film className="h-5 w-5" />
                        <span className="font-bold tracking-tight">HUSTheatre</span>
                    </div>
                    <p className="text-sm text-slate-500 text-center md:text-left">© 2026 HUSTheatre. Hệ thống đặt vé xem phim trực tuyến.</p>
                </div>
            </footer>
        </div>
    );
};
