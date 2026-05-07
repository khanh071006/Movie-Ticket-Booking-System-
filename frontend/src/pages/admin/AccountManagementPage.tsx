import { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Account } from '../../types/app';

const emptyCreate = { fullName: '', email: '', password: '', phone: '', isAdmin: false };
const emptyUpdate = { fullName: '', phone: '', isAdmin: false };

export const AccountManagementPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [createForm, setCreateForm] = useState(emptyCreate);
    const [editId, setEditId] = useState<string | null>(null);
    const [updateForm, setUpdateForm] = useState(emptyUpdate);

    const loadAccounts = () => {
        apiClient.accounts.getAll().then(setAccounts).catch((err) => setError(parseError(err)));
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return accounts;
        return accounts.filter((acc) => acc.fullName.toLowerCase().includes(q) || acc.email.toLowerCase().includes(q));
    }, [accounts, query]);

    const onCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            await apiClient.accounts.create({
                fullName: createForm.fullName,
                email: createForm.email,
                password: createForm.password,
                phone: createForm.phone.trim() ? createForm.phone : undefined,
                roles: createForm.isAdmin ? ['ADMIN'] : ['USER'],
            });
            setCreateForm(emptyCreate);
            loadAccounts();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const startEdit = (acc: Account) => {
        setEditId(acc.id);
        setUpdateForm({
            fullName: acc.fullName,
            phone: acc.phone ?? '',
            isAdmin: Boolean(acc.roles?.includes('ADMIN') || acc.roles?.includes('ROLE_ADMIN')),
        });
    };

    const onUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!editId) return;
        try {
            await apiClient.accounts.update(editId, {
                fullName: updateForm.fullName,
                phone: updateForm.phone.trim() ? updateForm.phone : undefined,
                roles: updateForm.isAdmin ? ['ADMIN'] : ['USER'],
            });
            setEditId(null);
            setUpdateForm(emptyUpdate);
            loadAccounts();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const onDelete = async (id: string) => {
        if (!confirm('Xóa tài khoản này?')) return;
        try {
            await apiClient.accounts.remove(id);
            loadAccounts();
        } catch (err) {
            setError(parseError(err));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý tài khoản</h1>
                    <p className="mt-1 text-slate-500">Theo dõi và cập nhật thông tin người dùng trong hệ thống.</p>
                </div>
            </div>

            <Card className="p-4">
                <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-5">
                    <Input placeholder="Họ và tên" value={createForm.fullName} onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))} required />
                    <Input placeholder="Email" type="email" value={createForm.email} onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} required />
                    <Input placeholder="Mật khẩu" type="password" value={createForm.password} onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))} required />
                    <Input placeholder="Số điện thoại" value={createForm.phone} onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))} />
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={createForm.isAdmin} onChange={(e) => setCreateForm((p) => ({ ...p, isAdmin: e.target.checked }))} />
                            Quản trị viên
                        </label>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Tạo tài khoản
                        </Button>
                    </div>
                </form>
            </Card>

            <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b bg-slate-50 p-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input className="bg-white pl-9" placeholder="Tìm kiếm tài khoản..." value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Họ tên</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Số điện thoại</th>
                                <th className="px-6 py-4 font-medium">Vai trò</th>
                                <th className="px-6 py-4 text-right font-medium">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rows.map((acc) => (
                                <tr key={acc.id} className="bg-white">
                                    <td className="px-6 py-4 font-medium text-slate-900">{acc.fullName}</td>
                                    <td className="px-6 py-4 text-slate-500">{acc.email}</td>
                                    <td className="px-6 py-4 text-slate-500">{acc.phone || '-'}</td>
                                    <td className="px-6 py-4 text-slate-500">{acc.roles?.join(', ') || 'Người dùng'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => startEdit(acc)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => onDelete(acc.id)}>
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

            {editId && (
                <Card className="p-4">
                    <form onSubmit={onUpdate} className="grid gap-3 md:grid-cols-4">
                        <Input placeholder="Họ và tên" value={updateForm.fullName} onChange={(e) => setUpdateForm((p) => ({ ...p, fullName: e.target.value }))} required />
                        <Input placeholder="Số điện thoại" value={updateForm.phone} onChange={(e) => setUpdateForm((p) => ({ ...p, phone: e.target.value }))} />
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={updateForm.isAdmin} onChange={(e) => setUpdateForm((p) => ({ ...p, isAdmin: e.target.checked }))} />
                            Quản trị viên
                        </label>
                        <div className="flex items-center gap-2">
                            <Button type="submit">Lưu thay đổi</Button>
                            <Button type="button" variant="outline" className="text-slate-600" onClick={() => setEditId(null)}>
                                Huỷ
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>
    );
};
