import { useEffect, useState } from 'react';
import { Edit2, MapPin, Plus, Trash2 } from 'lucide-react';
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

    const load = () => apiClient.cinemas.getAll().then(setCinemas).catch((err) => setError(parseError(err)));

    useEffect(() => {
        load();
    }, []);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
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
        if (!confirm('Xóa rạp này?')) return;
        try {
            await apiClient.cinemas.remove(id);
            load();
        } catch (err) {
            setError(parseError(err));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý rạp chiếu</h1>
                <p className="mt-1 text-slate-500">Cập nhật danh sách rạp để khách hàng dễ dàng chọn địa điểm xem phim.</p>
            </div>
            <Card className="p-4">
                <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
                    <Input placeholder="Tên rạp" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                    <Input className="md:col-span-2" placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />
                    <div className="md:col-span-3 flex gap-2">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            {editId ? 'Cập nhật rạp' : 'Thêm rạp mới'}
                        </Button>
                        {editId && (
                            <Button type="button" variant="outline" className="text-slate-600" onClick={() => { setEditId(null); setForm(emptyForm); }}>
                                Huỷ
                            </Button>
                        )}
                    </div>
                </form>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Rạp chiếu</th>
                                <th className="px-6 py-4 text-right font-medium">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {cinemas.map((cinema) => (
                                <tr key={cinema.id} className="bg-white">
                                    <td className="px-6 py-4">
                                        <div className="text-base font-medium text-slate-900">{cinema.name}</div>
                                        <div className="mt-1 flex items-center gap-1.5 text-slate-500">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {cinema.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => startEdit(cinema)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => remove(cinema.id)}>
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
