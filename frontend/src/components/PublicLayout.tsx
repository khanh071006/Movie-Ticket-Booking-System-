import { Film, LogIn } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { clearSession, getStoredToken, hasAdminRole } from '../features/auth/utils/session';

export const PublicLayout = () => {
    const token = getStoredToken();
    const navigate = useNavigate();
    const isAdmin = hasAdminRole(token);

    const handleLogout = () => {
        clearSession();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-slate-50 selection:bg-blue-500/30">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-lg">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="group flex items-center gap-2.5">
                        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg shadow-blue-500/20 transition-shadow group-hover:shadow-blue-500/40">
                            <Film className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            HUS<span className="text-blue-500">Theatre</span>
                        </span>
                    </Link>
                    <nav className="flex items-center gap-3">
                        <Link to="/" className="text-sm text-slate-300 hover:text-white">
                            Trang chủ
                        </Link>
                        {token ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin">
                                        <Button size="sm" className="border-0 bg-blue-600 text-white hover:bg-blue-700">
                                            Admin Panel
                                        </Button>
                                    </Link>
                                )}
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Đăng xuất
                                </Button>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button variant="outline" size="sm" className="gap-2 text-slate-300 hover:text-white">
                                    <LogIn className="h-4 w-4" />
                                    Đăng nhập
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
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
                    <p className="text-sm text-slate-500">© 2026 HUSTheatre. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
