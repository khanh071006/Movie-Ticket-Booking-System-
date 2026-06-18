import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, CalendarDays, ChevronRight, Clock, MonitorPlay, Building2 } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Cinema, Movie, Room, Showtime } from '../../types/app';
import { getStoredAccount } from '../../features/auth/utils/session';

export const ShowtimeManagementPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [movieId, setMovieId] = useState<string>('');
    const [cinemaId, setCinemaId] = useState<number | ''>('');
    const [roomId, setRoomId] = useState<number | ''>('');
    const [startTime, setStartTime] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const account = getStoredAccount();
    const isStaff = account?.roles?.includes('STAFF') || account?.roles?.includes('ROLE_STAFF');

    useEffect(() => {
        Promise.all([apiClient.movies.getAll(0, 1000).then(res => res.content), apiClient.cinemas.getAll(0, 1000).then(res => res.content)])
            .then(([m, c]) => {
                setMovies(m);
                setCinemas(c);
                if (m.length) setMovieId(m[0].id);
                if (c.length) setCinemaId(c[0].id);
            })
            .catch((err) => setError(parseError(err)));
    }, []);

    useEffect(() => {
        if (!cinemaId) return;
        apiClient.rooms.getByCinema(cinemaId as number).then((res) => {
            setRooms(res);
            if (res.length) setRoomId(res[0].id);
        });
    }, [cinemaId]);

    const loadShowtimes = useCallback(() => {
        if (!movieId || !cinemaId) return;
        setLoading(true);
        apiClient.showtimes.getByMovieAndCinema(movieId, cinemaId)
            .then(setShowtimes)
            .catch((err) => setError(parseError(err)))
            .finally(() => setLoading(false));
    }, [cinemaId, movieId]);

    useEffect(() => {
        loadShowtimes();
    }, [loadShowtimes]);

    const selectedMovie = useMemo(() => movies.find((m) => m.id === movieId), [movies, movieId]);

    const onCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            await apiClient.showtimes.create({ movieId, roomId: roomId as number, startTime });
            setStartTime('');
            loadShowtimes();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await apiClient.showtimes.remove(deleteId);
            setDeleteId(null);
            loadShowtimes();
        } catch (err) {
            setError(parseError(err));
            setDeleteId(null);
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                    <span>Admin</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-400">Scheduling</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    LỊCH <span className="text-blue-600">CHIẾU</span>
                </h1>
                <p className="text-slate-400">Điều phối suất chiếu, phòng chiếu và thời gian vận hành cho từng bộ phim.</p>
            </div>

            {/* Create Section */}
            {!isStaff && (
                <Card className="overflow-hidden border-white/10 bg-zinc-900/50 p-0 backdrop-blur-md">
                    <div className="flex items-center gap-3 border-b border-white/5 bg-white/5 px-6 py-4">
                        <div className="rounded-lg bg-blue-600/20 p-2 text-blue-500">
                            <CalendarDays size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-white">Sắp xếp suất chiếu mới</h2>
                    </div>
                    <form onSubmit={onCreate} className="p-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Phim</label>
                                <select 
                                    className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                    value={movieId} 
                                    onChange={(e) => setMovieId(e.target.value)}
                                >
                                    {movies.map((movie) => (
                                        <option key={movie.id} value={movie.id} className="bg-[#141414]">{movie.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Rạp</label>
                                <select 
                                    className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                    value={cinemaId} 
                                    onChange={(e) => setCinemaId(Number(e.target.value))}
                                >
                                    {cinemas.map((cinema) => (
                                        <option key={cinema.id} value={cinema.id} className="bg-[#141414]">{cinema.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Phòng</label>
                                <select 
                                    className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                    value={roomId} 
                                    onChange={(e) => setRoomId(Number(e.target.value))}
                                >
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id} className="bg-[#141414]">{room.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Thời gian bắt đầu</label>
                                <input 
                                    className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]" 
                                    type="datetime-local" 
                                    value={startTime} 
                                    onChange={(e) => setStartTime(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end border-t border-white/5 pt-6">
                            <Button className="h-11 px-10 font-bold shadow-xl shadow-blue-900/20 gap-2">
                                <Plus size={18} /> Thêm suất chiếu
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* List Section */}
            <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-blue-500" />
                        Lịch chiếu hiện tại
                    </h3>
                    <div className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-500 border border-blue-500/20">
                        {selectedMovie?.title || 'Đang chọn phim...'}
                    </div>
                </div>

                <Card className="overflow-hidden border-white/10 bg-zinc-900/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Thời gian</th>
                                    <th className="px-6 py-4 font-bold">Địa điểm</th>
                                    {!isStaff && <th className="px-6 py-4 text-right font-bold">Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {showtimes.length > 0 ? (
                                    showtimes.map((st) => (
                                        <tr key={st.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="font-bold text-slate-200">
                                                        {new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {new Date(st.startTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                                                        <MonitorPlay size={12} className="text-blue-500" />
                                                        {st.room?.name ?? '-'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <Building2 size={12} className="text-blue-500" />
                                                        {st.room?.cinema?.name ?? '-'}
                                                    </div>
                                                </div>
                                            </td>
                                            {!isStaff && (
                                                <td className="px-6 py-4 text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-9 w-9 text-red-500 hover:bg-red-500/10 opacity-100 transition-opacity" 
                                                        onClick={() => setDeleteId(st.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-600 italic">
                                            {loading ? 'Đang tải lịch chiếu...' : 'Chưa có suất chiếu nào cho phim và rạp này.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 animate-in slide-in-from-bottom-2">
                    {error}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa suất chiếu này khỏi hệ thống? Hành động này không thể hoàn tác."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Xóa suất chiếu"
            />
        </div>
    );
};
