import { useCallback, useEffect, useState } from 'react';
import { Edit2, Plus, Trash2, Coffee, ChevronRight } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CategorySelect } from '../../components/ui/CategorySelect';
import type { Snack } from '../../types/app';
import { Pagination } from '../../components/ui/Pagination';

export const SnackManagementPage = () => {
    const [items, setItems] = useState<Snack[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // Form state
    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState<string>('');
    const [snackTypeId, setSnackTypeId] = useState<string>('');
    const [imageUrl, setImageUrl] = useState('');
    
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const snacksData = await apiClient.snacks.getAll(currentPage, 10);
            setItems(snacksData.content);
            setTotalPages(snacksData.totalPages);
            setTotalElements(snacksData.totalElements);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        load();
    }, [load]);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            const price = parseInt(basePrice, 10);
            if (isNaN(price) || price < 0) {
                setError("Giá không hợp lệ");
                return;
            }

            const typeId = parseInt(snackTypeId, 10);
            if (isNaN(typeId)) {
                setError("Vui lòng chọn loại đồ ăn");
                return;
            }

            if (editId) await apiClient.snacks.update(editId, { name, basePrice: price, snackTypeId: typeId, imageUrl });
            else await apiClient.snacks.create({ name, basePrice: price, snackTypeId: typeId, imageUrl });
            
            setName('');
            setBasePrice('');
            setImageUrl('');
            setEditId(null);
            load();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await apiClient.snacks.remove(deleteId);
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
                    <span className="text-slate-400">Snacks</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    ĐỒ ĂN / <span className="text-blue-600">NƯỚC UỐNG</span>
                </h1>
                <p className="text-slate-400">Quản lý các mặt hàng đồ ăn, thức uống (Combo, Bắp, Nước...) bán kèm tại rạp.</p>
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
                                {editId ? 'Sửa món' : 'Thêm món mới'}
                            </h2>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Loại mặt hàng</label>
                                <CategorySelect 
                                    kind="snack-types"
                                    value={snackTypeId}
                                    onChange={setSnackTypeId}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tên món</label>
                                <Input 
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                    placeholder="VD: Combo Bắp Nước 1"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Giá bán (VND)</label>
                                <Input 
                                    type="number"
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                    placeholder="VD: 85000"
                                    value={basePrice} 
                                    onChange={(e) => setBasePrice(e.target.value)} 
                                    required 
                                    min="0"
                                    step="1000"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Link ảnh (Tùy chọn)</label>
                                <Input 
                                    type="url"
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl} 
                                    onChange={(e) => setImageUrl(e.target.value)} 
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
                                            setImageUrl('');
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
                                <Coffee size={18} className="text-blue-500" /> Danh sách món ăn
                            </h3>
                            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-500 border border-blue-500/20">
                                {totalElements} mục
                            </span>
                        </div>
                        
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 z-10 border-b border-white/5 bg-zinc-900 px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Phân loại</th>
                                        <th className="px-6 py-4 font-bold">Tên món</th>
                                        <th className="px-6 py-4 font-bold">Giá bán</th>
                                        <th className="px-6 py-4 text-right font-bold">Quản lý</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 text-slate-400 font-medium">
                                                    {item.snackTypeName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {item.imageUrl ? (
                                                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-white/10 bg-zinc-800">
                                                                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-zinc-800 text-xs font-bold text-slate-500">
                                                                N/A
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                                                            {item.name}
                                                        </span>
                                                    </div>
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
                                                                setSnackTypeId(item.snackTypeId.toString());
                                                                setImageUrl(item.imageUrl || '');
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
                                                {loading ? 'Đang tải dữ liệu...' : 'Chưa có dữ liệu đồ ăn/thức uống.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={setCurrentPage} 
                    />
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
                message="Bạn có chắc chắn muốn xóa món này? Hành động này có thể ảnh hưởng đến các giao dịch đặt hàng trước đó."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Xóa món"
            />
        </div>
    );
};
