import { useCallback, useEffect, useState } from 'react';
import { Edit2, Plus, Trash2, Ticket, ChevronRight } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { TicketType } from '../../types/app';

export const TicketTypeManagementPage = () => {
    const [items, setItems] = useState<TicketType[]>([]);
    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState<string>('');
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiClient.ticketTypes.getAll();
            setItems(data);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            const price = parseInt(basePrice, 10);
            if (isNaN(price) || price < 0) {
                setError("Giá vé không hợp lệ");
                return;
            }

            if (editId) await apiClient.ticketTypes.update(editId, { name, basePrice: price });
            else await apiClient.ticketTypes.create({ name, basePrice: price });
            
            setName('');
            setBasePrice('');
            setEditId(null);
            load();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await apiClient.ticketTypes.remove(deleteId);
            setDeleteId(null);
            load();
        } catch (err) {
            setError(parseError(err));
            setDeleteId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                    <span>Admin</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-400">Ticket Types</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    LOẠI <span className="text-blue-600">VÉ</span>
                </h1>
                <p className="text-slate-400">Quản lý các loại vé (Người lớn, Trẻ em, Học sinh...) và mức giá cơ bản.</p>
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
                                {editId ? 'Sửa loại vé' : 'Thêm loại vé'}
                            </h2>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tên loại vé</label>
                                <Input 
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                    placeholder="VD: Vé Người Lớn"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Giá cơ bản (VND)</label>
                                <Input 
                                    type="number"
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                    placeholder="VD: 50000"
                                    value={basePrice} 
                                    onChange={(e) => setBasePrice(e.target.value)} 
                                    required 
                                    min="0"
                                    step="1000"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2 pt-2">
                                <Button className="h-12 w-full gap-2 font-bold shadow-xl shadow-blue-900/20">
                                    {editId ? 'Cập nhật thay đổi' : 'Xác nhận thêm'}
                                </Button>
                                {editId && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="h-12 w-full border-white/10 text-slate-400 hover:text-white" 
                                        onClick={() => { 
                                            setEditId(null); 
                                            setName(''); 
                                            setBasePrice(''); 
                                        }}
                                    >
                                        Huỷ bỏ
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Card>
                </div>

                {/* List Section */}
                <div className="lg:col-span-8">
                    <Card className="overflow-hidden border-white/10 bg-zinc-900/30">
                        <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4">
                            <h3 className="font-bold text-slate-300 flex items-center gap-2">
                                <Ticket size={18} className="text-blue-500" /> Danh sách loại vé
                            </h3>
                            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-500 border border-blue-500/20">
                                {items.length} mục
                            </span>
                        </div>
                        
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 z-10 border-b border-white/5 bg-zinc-900 px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Mã ID</th>
                                        <th className="px-6 py-4 font-bold">Tên loại vé</th>
                                        <th className="px-6 py-4 font-bold">Giá cơ bản</th>
                                        <th className="px-6 py-4 text-right font-bold">Quản lý</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                                    #{item.id}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 text-green-400 font-medium">
                                                    {formatCurrency(item.basePrice)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-blue-500 hover:bg-blue-500/10" 
                                                            onClick={() => { 
                                                                setEditId(item.id); 
                                                                setName(item.name); 
                                                                setBasePrice(item.basePrice.toString());
                                                            }}
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-red-500 hover:bg-red-500/10" 
                                                            onClick={() => setDeleteId(item.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-slate-600 italic">
                                                {loading ? 'Đang tải dữ liệu...' : 'Chưa có dữ liệu loại vé.'}
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
                message="Bạn có chắc chắn muốn xóa loại vé này? Hành động này có thể ảnh hưởng đến các suất chiếu đang đặt."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Xóa loại vé"
            />
        </div>
    );
};
