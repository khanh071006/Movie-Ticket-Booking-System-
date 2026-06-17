import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Trash2, Tags, Hash, ChevronRight } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { CategoryItem } from '../../types/app';

type CategoryKey = 'directors' | 'genres' | 'movie-statuses' | 'cast-members' | 'states' | 'snack-types';

const kinds: Array<{ key: CategoryKey; label: string; icon: any }> = [
    { key: 'directors', label: 'Đạo diễn', icon: Tags },
    { key: 'cast-members', label: 'Diễn viên', icon: Tags },
    { key: 'states', label: 'Trạng thái rạp', icon: Tags },
    { key: 'movie-statuses', label: 'Trạng thái phim', icon: Tags },
    { key: 'genres', label: 'Thể loại phim', icon: Hash },
    { key: 'snack-types', label: 'Loại đồ ăn', icon: Tags },
];

export const CategoryManagementPage = () => {
    const [active, setActive] = useState<CategoryKey>('directors');
    const [items, setItems] = useState<CategoryItem[]>([]);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const current = useMemo(() => kinds.find((k) => k.key === active)!, [active]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiClient.categories.getAll(active);
            setItems(data);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    }, [active]);

    useEffect(() => {
        load();
    }, [load]);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            if (editId) await apiClient.categories.update(active, editId, { name, imageUrl });
            else await apiClient.categories.create(active, { name, imageUrl });
            setName('');
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
            await apiClient.categories.remove(active, deleteId);
            setDeleteId(null);
            load();
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
                    <span className="text-slate-400">Management</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    DANH <span className="text-blue-600">MỤC</span>
                </h1>
                <p className="text-slate-400">Phân loại dữ liệu giúp hệ thống tìm kiếm và hiển thị phim chuyên nghiệp hơn.</p>
            </div>

            {/* Kind Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/5 p-1.5 border border-white/5">
                {kinds.map((kind) => {
                    const isActive = active === kind.key;
                    return (
                        <button
                            key={kind.key}
                            type="button"
                            onClick={() => {
                                setActive(kind.key);
                                setEditId(null);
                                setName('');
                                setImageUrl('');
                            }}
                            className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                                isActive 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                        >
                            <kind.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            {kind.label}
                        </button>
                    );
                })}
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
                                {editId ? `Sửa ${current.label}` : `Thêm ${current.label}`}
                            </h2>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tên mục</label>
                                <Input 
                                    className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                    placeholder={`VD: ${active === 'directors' ? 'Christopher Nolan' : active === 'genres' ? 'Hành động' : 'Tên mục...'}`}
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                            </div>

                            {(active === 'directors' || active === 'cast-members') && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Link ảnh chân dung (Tùy chọn)</label>
                                    <Input 
                                        type="url"
                                        className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                        placeholder="https://example.com/avatar.jpg"
                                        value={imageUrl} 
                                        onChange={(e) => setImageUrl(e.target.value)} 
                                    />
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-2 pt-2">
                                <Button className="h-12 w-full gap-2 font-bold shadow-xl shadow-blue-900/20">
                                    {editId ? 'Cập nhật thay đổi' : 'Xác nhận thêm'}
                                </Button>
                                {editId && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="h-12 w-full border-white/10 text-slate-400 hover:text-white" 
                                        onClick={() => { setEditId(null); setName(''); setImageUrl(''); }}
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
                            <h3 className="font-bold text-slate-300">Danh sách {current.label.toLowerCase()}</h3>
                            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-500 border border-blue-500/20">
                                {items.length} mục
                            </span>
                        </div>
                        
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 z-10 border-b border-white/5 bg-zinc-900 px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Tên mục hiển thị</th>
                                        <th className="px-6 py-4 text-right font-bold">Quản lý</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {(active === 'directors' || active === 'cast-members') && (
                                                            item.imageUrl ? (
                                                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10 bg-zinc-800">
                                                                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-xs font-bold text-slate-500">
                                                                    N/A
                                                                </div>
                                                            )
                                                        )}
                                                        <span className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-blue-500 hover:bg-blue-500/10" 
                                                            onClick={() => { setEditId(item.id); setName(item.name); setImageUrl(item.imageUrl || ''); }}
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
                                            <td colSpan={2} className="px-6 py-20 text-center text-slate-600 italic">
                                                {loading ? 'Đang tải dữ liệu...' : 'Chưa có dữ liệu cho danh mục này.'}
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
                message={`Bạn có chắc chắn muốn xóa ${current.label.toLowerCase()} này khỏi hệ thống? Hành động này không thể hoàn tác.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Xóa mục"
            />
        </div>
    );
};
