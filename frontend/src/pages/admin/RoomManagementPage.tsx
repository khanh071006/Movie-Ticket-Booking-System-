import { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2, ChevronRight, MonitorPlay, Building2, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Cinema, Room } from '../../types/app';

export const RoomManagementPage = () => {
    const navigate = useNavigate();
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [selectedCinemaId, setSelectedCinemaId] = useState<number | ''>('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [name, setName] = useState<string>('');
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        apiClient.cinemas.getAll().then((res) => {
            setCinemas(res);
            if (res.length) setSelectedCinemaId(res[0].id);
        });
    }, []);

    const loadRooms = (cinemaId: number | '') => {
        if (!cinemaId) return;
        setLoading(true);
        apiClient.rooms.getByCinema(cinemaId)
            .then(setRooms)
            .catch((err) => setError(parseError(err)))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadRooms(selectedCinemaId);
    }, [selectedCinemaId]);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            if (!selectedCinemaId) return;
            if (editId) await apiClient.rooms.update(editId, { name, cinemaId: selectedCinemaId as number });
            else await apiClient.rooms.create({ name, cinemaId: selectedCinemaId as number });
            setName('');
            setEditId(null);
            loadRooms(selectedCinemaId);
        } catch (err) {
            setError(parseError(err));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await apiClient.rooms.remove(deleteId);
            setDeleteId(null);
            loadRooms(selectedCinemaId);
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
                    <span className="text-slate-400">Cinemas</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    PHÒNG <span className="text-blue-600">CHIẾU</span>
                </h1>
                <p className="text-slate-400">Quản lý không gian chiếu phim, số lượng ghế và hạ tầng kỹ thuật của rạp.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Form Section */}
                <div className="lg:col-span-4">
                    <Card className="sticky top-8 border-white/10 bg-zinc-900/50 p-6 backdrop-blur-md">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-600/20 p-2 text-blue-500">
                                {editId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            </div>
                            <h2 className="text-lg font-bold text-white">
                                {editId ? 'Sửa phòng chiếu' : 'Thêm phòng mới'}
                            </h2>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Chọn rạp chiếu</label>
                                <select
                                    className="h-12 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={selectedCinemaId}
                                    onChange={(e) => setSelectedCinemaId(Number(e.target.value))}
                                >
                                    {cinemas.map((cinema) => (
                                        <option key={cinema.id} value={cinema.id} className="bg-[#141414]">
                                            {cinema.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tên phòng chiếu</label>
                                <Input 
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                    placeholder="VD: Phòng 01 - IMAX" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2 pt-2">
                                <Button className="h-12 w-full gap-2 font-bold shadow-xl shadow-blue-900/20">
                                    {editId ? 'Cập nhật phòng' : 'Thêm phòng chiếu'}
                                </Button>
                                {editId && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="h-12 w-full border-white/10 text-slate-400 hover:text-white" 
                                        onClick={() => { setEditId(null); setName(''); }}
                                    >
                                        Huỷ bỏ
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Card>
                </div>

                {/* List Section */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <MonitorPlay className="text-blue-500" />
                            Phòng chiếu tại rạp ({rooms.length})
                        </h3>
                    </div>

                    <Card className="overflow-hidden border-white/10 bg-zinc-900/30">
                        <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-6 py-3 text-xs font-bold text-slate-400">
                            <Building2 size={14} className="text-blue-500" />
                            {cinemas.find(c => c.id === selectedCinemaId)?.name || 'Đang chọn rạp...'}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Tên phòng chiếu</th>
                                        <th className="px-6 py-4 text-right font-bold">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {rooms.length > 0 ? (
                                        rooms.map((room) => (
                                            <tr key={room.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                                                        {room.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-9 w-9 text-blue-500 hover:bg-blue-500/10" 
                                                            onClick={() => { setEditId(room.id); setName(room.name); }}
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            title="Cấu hình ghế"
                                                            className="h-9 w-9 text-green-500 hover:bg-green-500/10" 
                                                            onClick={() => navigate(`/admin/rooms/${room.id}/seats`)}
                                                        >
                                                            <Grid size={16} />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-9 w-9 text-red-500 hover:bg-red-500/10" 
                                                            onClick={() => setDeleteId(room.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-20 text-center text-slate-600 italic">
                                                {loading ? 'Đang tải dữ liệu...' : 'Rạp này chưa có phòng chiếu nào.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 animate-in slide-in-from-bottom-2">
                    {error}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa phòng chiếu này khỏi hệ thống? Hành động này không thể hoàn tác."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Xóa phòng"
            />
        </div>
    );
};
