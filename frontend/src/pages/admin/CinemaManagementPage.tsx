import { useEffect, useState } from 'react';
import { Edit2, MapPin, Plus, Trash2, ChevronRight, Building2, Map as MapIcon } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Cinema } from '../../types/app';

const emptyForm = { name: '', address: '' };

export const CinemaManagementPage = () => {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await apiClient.cinemas.getAll();
            setCinemas(res);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            if (editId) await apiClient.cinemas.update(editId, form);
            else await apiClient.cinemas.create(form);
            setForm(emptyForm);
            setEditId(null);
            load();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const startEdit = (cinema: Cinema) => {
        setEditId(cinema.id);
        setForm({ name: cinema.name, address: cinema.address });
    };

    const remove = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa rạp chiếu này?')) return;
        try {
            await apiClient.cinemas.remove(id);
            load();
        } catch (err) {
            setError(parseError(err));
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                    <span>Admin</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-400">Cinemas</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    HỆ THỐNG <span className="text-blue-600 font-serif">RẠP</span>
                </h1>
                <p className="text-slate-400">Quản lý địa điểm, rạp chiếu và thông tin liên hệ trên toàn hệ thống.</p>
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
                                {editId ? 'Sửa thông tin rạp' : 'Thêm rạp mới'}
                            </h2>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tên rạp chiếu</label>
                                <Input 
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                    placeholder="VD: HUSTheatre Giải Phóng" 
                                    value={form.name} 
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} 
                                    required 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Địa chỉ chi tiết</label>
                                <Input 
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                    placeholder="VD: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội" 
                                    value={form.address} 
                                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} 
                                    required 
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2 pt-2">
                                <Button className="h-12 w-full gap-2 font-bold shadow-xl shadow-blue-900/20">
                                    {editId ? 'Cập nhật rạp' : 'Thêm rạp mới'}
                                </Button>
                                {editId && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="h-12 w-full border-white/10 text-slate-400 hover:text-white" 
                                        onClick={() => { setEditId(null); setForm(emptyForm); }}
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
                            <Building2 className="text-blue-500" />
                            Danh sách rạp chiếu ({cinemas.length})
                        </h3>
                    </div>

                    <Card className="overflow-hidden border-white/10 bg-zinc-900/30">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Thông tin rạp</th>
                                        <th className="px-6 py-4 text-right font-bold">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {cinemas.length > 0 ? (
                                        cinemas.map((cinema) => (
                                            <tr key={cinema.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-base font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                                                            {cinema.name}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                            <MapPin className="h-3 w-3 text-blue-500" />
                                                            {cinema.address}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-9 w-9 text-blue-500 hover:bg-blue-500/10" 
                                                            onClick={() => startEdit(cinema)}
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-9 w-9 text-red-500 hover:bg-red-500/10" 
                                                            onClick={() => remove(cinema.id)}
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
                                                {loading ? 'Đang tải dữ liệu...' : 'Chưa có rạp chiếu nào được đăng ký.'}
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
        </div>
    );
};
