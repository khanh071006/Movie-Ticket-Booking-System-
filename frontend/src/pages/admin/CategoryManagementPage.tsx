import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { CategoryItem } from '../../types/app';

type CategoryKey = 'directors' | 'genres' | 'movie-statuses' | 'cast-members';

const kinds: Array<{ key: CategoryKey; label: string }> = [
    { key: 'directors', label: 'Đạo diễn' },
    { key: 'genres', label: 'Thể loại' },
    { key: 'movie-statuses', label: 'Trạng thái phim' },
    { key: 'cast-members', label: 'Diễn viên' },
];

export const CategoryManagementPage = () => {
    const [active, setActive] = useState<CategoryKey>('directors');
    const [items, setItems] = useState<CategoryItem[]>([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState('');

    const current = useMemo(() => kinds.find((k) => k.key === active)!, [active]);

    const load = useCallback(() => {
        apiClient.categories.getAll(active).then(setItems).catch((err) => setError(parseError(err)));
    }, [active]);

    useEffect(() => {
        load();
    }, [load]);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (editId) await apiClient.categories.update(active, editId, name);
            else await apiClient.categories.create(active, name);
            setName('');
            setEditId(null);
            load();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const remove = async (id: string) => {
        if (!confirm('Xóa mục danh mục này?')) return;
        try {
            await apiClient.categories.remove(active, id);
            load();
        } catch (err) {
            setError(parseError(err));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý danh mục</h1>
                <p className="mt-1 text-slate-500">Cập nhật dữ liệu danh mục để trang phim hiển thị đầy đủ và nhất quán.</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {kinds.map((kind) => (
                    <button
                        key={kind.key}
                        type="button"
                        onClick={() => {
                            setActive(kind.key);
                            setEditId(null);
                            setName('');
                        }}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${active === kind.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        {kind.label}
                    </button>
                ))}
            </div>
            <Card className="p-4">
                <p className="mb-3 text-sm text-slate-500">
                    Nhóm danh mục đang chỉnh sửa: <span className="font-semibold text-slate-700">{current.label}</span>
                </p>
                <form onSubmit={submit} className="flex flex-wrap items-center gap-3">
                    <Input placeholder={`Nhập tên ${current.label.toLowerCase()}`} value={name} onChange={(e) => setName(e.target.value)} required />
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        {editId ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                    {editId && (
                        <Button type="button" variant="outline" className="text-slate-600" onClick={() => { setEditId(null); setName(''); }}>
                            Huỷ
                        </Button>
                    )}
                </form>
            </Card>
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Tên</th>
                                <th className="px-6 py-4 text-right font-medium">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.map((item) => (
                                <tr key={item.id} className="bg-white">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => { setEditId(item.id); setName(item.name); }}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => remove(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>
    );
};
