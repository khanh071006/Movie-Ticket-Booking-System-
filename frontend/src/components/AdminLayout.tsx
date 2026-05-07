import { CalendarDays, Clapperboard, Film, LayoutDashboard, LogOut, MapPin, MonitorPlay, Tags, Users } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearSession, getStoredAccount } from '../features/auth/utils/session';

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Accounts', path: '/admin/accounts', icon: Users },
    { name: 'Movies', path: '/admin/movies', icon: Clapperboard },
    { name: 'Cinemas', path: '/admin/cinemas', icon: MapPin },
    { name: 'Rooms', path: '/admin/rooms', icon: MonitorPlay },
    { name: 'Showtimes', path: '/admin/showtimes', icon: CalendarDays },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
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
        <div className="flex min-h-screen bg-slate-50">
            <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
                <div className="flex h-16 items-center border-b border-slate-100 px-6">
                    <Link to="/" className="group flex items-center gap-2">
                        <div className="rounded-lg bg-blue-600 p-1.5 shadow-sm">
                            <Film className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold tracking-tight text-slate-900">HUSTheatre</span>
                        <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Admin</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <item.icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 pb-6">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                            {account?.fullName?.charAt(0).toUpperCase() ?? 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-semibold text-slate-900">{account?.fullName ?? 'Admin'}</p>
                            <p className="truncate text-xs text-slate-500">{account?.email ?? 'admin@local'}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-start gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4" />
                        Exit to App
                    </button>
                </div>
            </aside>

            <main className="min-w-0 flex-1 overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
                    <span className="font-bold">HUS Admin</span>
                    <button type="button" onClick={handleLogout} className="text-sm font-medium text-slate-500">
                        Exit
                    </button>
                </header>
                <div className="h-full overflow-y-auto p-4 md:p-8 lg:p-10">
                    <div className="mx-auto max-w-6xl">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
