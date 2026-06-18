import { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Search, Trash2, Users, Shield, Mail, Phone, ChevronRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Account, Cinema } from '../../types/app';
import { getStoredAccount } from '../../features/auth/utils/session';
import { Pagination } from '../../components/ui/Pagination';

const emptyCreate = { fullName: '', email: '', password: '', phone: '', role: 'USER', cinemaId: '' };
const emptyUpdate = { fullName: '', phone: '', role: 'USER', cinemaId: '' };

export const AccountManagementPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [createForm, setCreateForm] = useState(emptyCreate);
    const [editId, setEditId] = useState<string | null>(null);
    const [updateForm, setUpdateForm] = useState(emptyUpdate);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const currentUser = getStoredAccount();
    const isSuperAdmin = currentUser?.roles?.includes('SUPERADMIN') || currentUser?.roles?.includes('ROLE_SUPERADMIN');

    const loadData = async () => {
        setLoading(true);
        try {
            const [accountsData, cinemasData] = await Promise.all([
                apiClient.accounts.getAll(currentPage, 10, query),
                apiClient.cinemas.getAll(0, 1000).then(res => res.content)
            ]);
            setAccounts(accountsData.content);
            setTotalPages(accountsData.totalPages);
            setTotalElements(accountsData.totalElements);
            setCinemas(cinemasData);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadData();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [currentPage, query]);

    const rows = accounts;

    const onCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            await apiClient.accounts.create({
                fullName: createForm.fullName,
                email: createForm.email,
                password: createForm.password,
                phone: createForm.phone.trim() ? createForm.phone : undefined,
                roles: [createForm.role],
                cinemaId: (createForm.role === 'STAFF' || createForm.role === 'MANAGER') && createForm.cinemaId ? Number(createForm.cinemaId) : undefined,
            } as any);
            setCreateForm(emptyCreate);
            loadData();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const startEdit = (acc: Account) => {
        setEditId(acc.id);
        const accRoles = acc.roles || [];
        const role = accRoles.includes('SUPERADMIN') || accRoles.includes('ROLE_SUPERADMIN') ? 'SUPERADMIN' 
                   : accRoles.includes('MANAGER') || accRoles.includes('ROLE_MANAGER') ? 'MANAGER'
                   : accRoles.includes('STAFF') || accRoles.includes('ROLE_STAFF') ? 'STAFF' 
                   : 'USER';
        setUpdateForm({
            fullName: acc.fullName,
            phone: acc.phone ?? '',
            role,
            cinemaId: acc.cinemaId ? String(acc.cinemaId) : '',
        });
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const onUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!editId) return;
        try {
            await apiClient.accounts.update(editId, {
                fullName: updateForm.fullName,
                phone: updateForm.phone.trim() ? updateForm.phone : undefined,
                roles: [updateForm.role],
                cinemaId: (updateForm.role === 'STAFF' || updateForm.role === 'MANAGER') && updateForm.cinemaId ? Number(updateForm.cinemaId) : null,
            } as any);
            setEditId(null);
            setUpdateForm(emptyUpdate);
            loadData();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await apiClient.accounts.remove(deleteId);
            setDeleteId(null);
            loadData();
        } catch (err) {
            setError(parseError(err));
            setDeleteId(null);
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                    <span>Admin</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-400">Users</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    QUẢN LÝ <span className="text-blue-600">TÀI KHOẢN</span>
                </h1>
                <p className="text-slate-400">Phân quyền và quản lý thông tin định danh của người dùng và nhân viên.</p>
            </div>

            {/* Create Section */}
            <Card className="overflow-hidden border-white/10 bg-zinc-900/50 p-0 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-white/5 bg-white/5 px-6 py-4">
                    <div className="rounded-lg bg-blue-600/20 p-2 text-blue-500">
                        <UserPlus size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-white">Tạo tài khoản mới</h2>
                </div>
                <form onSubmit={onCreate} className="p-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Input 
                            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                            placeholder="Họ và tên" 
                            value={createForm.fullName} 
                            onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))} 
                            required 
                        />
                        <Input 
                            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                            placeholder="Email" 
                            type="email" 
                            value={createForm.email} 
                            onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} 
                            required 
                        />
                        <Input 
                            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                            placeholder="Mật khẩu" 
                            type="password" 
                            value={createForm.password} 
                            onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))} 
                            required 
                        />
                        <Input 
                            className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                            placeholder="Số điện thoại" 
                            value={createForm.phone} 
                            onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))} 
                        />
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex gap-4">
                            <select
                                className="h-11 rounded-md border border-white/10 bg-zinc-900 px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                                value={createForm.role}
                                onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
                            >
                                <option value="USER">Khách hàng</option>
                                <option value="STAFF">Nhân viên rạp</option>
                                <option value="MANAGER">Quản lý rạp</option>
                                {isSuperAdmin && <option value="SUPERADMIN">Quản trị hệ thống</option>}
                            </select>
                            {(createForm.role === 'STAFF' || createForm.role === 'MANAGER') && (
                                <select
                                    className="h-11 rounded-md border border-white/10 bg-zinc-900 px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                                    value={createForm.cinemaId}
                                    onChange={(e) => setCreateForm((p) => ({ ...p, cinemaId: e.target.value }))}
                                    required
                                >
                                    <option value="" disabled>-- Chọn rạp chiếu --</option>
                                    {cinemas.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <Button className="h-11 px-8 font-bold shadow-xl shadow-blue-900/20 gap-2">
                            <Plus size={18} /> Xác nhận tạo
                        </Button>
                    </div>
                </form>
            </Card>

            {/* List Section */}
            <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="text-blue-500" />
                        Danh sách thành viên ({totalElements})
                    </h3>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <Input 
                            className="h-10 border-white/10 bg-zinc-900 pl-10 text-white placeholder:text-slate-600 focus:border-blue-500" 
                            placeholder="Tìm kiếm theo tên hoặc email..." 
                            value={query} 
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setCurrentPage(0); // Reset to first page on new search
                            }} 
                        />
                    </div>
                </div>

                <Card className="overflow-hidden border-white/10 bg-zinc-900/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Thành viên</th>
                                    <th className="px-6 py-4 font-bold">Liên hệ</th>
                                    <th className="px-6 py-4 font-bold">Vai trò</th>
                                    <th className="px-6 py-4 text-right font-bold">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rows.length > 0 ? (
                                    rows.map((acc) => {
                                        const accRoles = acc.roles || [];
                                        const role = accRoles.includes('SUPERADMIN') || accRoles.includes('ROLE_SUPERADMIN') ? 'SUPERADMIN' 
                                                   : accRoles.includes('MANAGER') || accRoles.includes('ROLE_MANAGER') ? 'MANAGER'
                                                   : accRoles.includes('STAFF') || accRoles.includes('ROLE_STAFF') ? 'STAFF' 
                                                   : 'USER';
                                        return (
                                            <tr key={acc.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 font-bold text-white shadow-lg border border-white/10">
                                                            {acc.fullName?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{acc.fullName}</div>
                                                            <div className="text-xs text-slate-400">{acc.id.substring(0, 8)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                                            <Mail size={12} className="text-blue-500" />
                                                            {acc.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                                            <Phone size={12} className="text-blue-500" />
                                                            {acc.phone || 'Chưa cập nhật'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {role === 'SUPERADMIN' && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-500/20">
                                                            <Shield size={10} /> Hệ thống
                                                        </span>
                                                    )}
                                                    {role === 'MANAGER' && (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="inline-flex w-max items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-purple-400 border border-purple-500/20">
                                                                <Shield size={10} /> Quản lý
                                                            </span>
                                                            <span className="text-xs text-slate-400">{acc.cinemaName}</span>
                                                        </div>
                                                    )}
                                                    {role === 'STAFF' && (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="inline-flex w-max items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-orange-500 border border-orange-500/20">
                                                                Nhân viên
                                                            </span>
                                                            <span className="text-xs text-slate-400">{acc.cinemaName}</span>
                                                        </div>
                                                    )}
                                                    {role === 'USER' && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-blue-500 border border-blue-500/20">
                                                            Khách hàng
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-500/10" onClick={() => startEdit(acc)}>
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-500/10" onClick={() => setDeleteId(acc.id)}>
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-600 italic">
                                            {loading ? 'Đang tải danh sách...' : 'Không tìm thấy tài khoản nào.'}
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

            {/* Edit Modal (Inline Card) */}
            {editId && (
                <Card className="border-blue-500/30 bg-blue-500/5 p-6 backdrop-blur-xl animate-in slide-in-from-bottom-4 shadow-2xl shadow-blue-500/10">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-600 p-2 text-white">
                                <Edit2 size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Chỉnh sửa tài khoản</h2>
                                <p className="text-xs text-slate-400">Thay đổi thông tin và quyền hạn của thành viên</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setEditId(null)}>
                            &times;
                        </Button>
                    </div>

                    <form onSubmit={onUpdate} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Họ và tên</label>
                                <Input 
                                    className="h-11 border-white/10 bg-zinc-900 text-white focus:border-blue-500" 
                                    value={updateForm.fullName} 
                                    onChange={(e) => setUpdateForm((p) => ({ ...p, fullName: e.target.value }))} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Số điện thoại</label>
                                <Input 
                                    className="h-11 border-white/10 bg-zinc-900 text-white focus:border-blue-500" 
                                    value={updateForm.phone} 
                                    onChange={(e) => setUpdateForm((p) => ({ ...p, phone: e.target.value }))} 
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex gap-4">
                                <select
                                    className="h-11 rounded-md border border-white/10 bg-zinc-900 px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                                    value={updateForm.role}
                                    onChange={(e) => setUpdateForm((p) => ({ ...p, role: e.target.value }))}
                                >
                                    <option value="USER">Khách hàng</option>
                                    <option value="STAFF">Nhân viên rạp</option>
                                    <option value="MANAGER">Quản lý rạp</option>
                                    {isSuperAdmin && <option value="SUPERADMIN">Quản trị hệ thống</option>}
                                </select>
                                {(updateForm.role === 'STAFF' || updateForm.role === 'MANAGER') && (
                                    <select
                                        className="h-11 rounded-md border border-white/10 bg-zinc-900 px-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        value={updateForm.cinemaId}
                                        onChange={(e) => setUpdateForm((p) => ({ ...p, cinemaId: e.target.value }))}
                                        required
                                    >
                                        <option value="" disabled>-- Chọn rạp chiếu --</option>
                                        {cinemas.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" className="h-11 px-6 border-white/10 text-slate-400 hover:text-white" onClick={() => setEditId(null)}>
                                    Huỷ bỏ
                                </Button>
                                <Button type="submit" className="h-11 px-8 font-bold gap-2">
                                    <CheckCircle2 size={18} /> Lưu thay đổi
                                </Button>
                            </div>
                        </div>
                    </form>
                </Card>
            )}

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 animate-in slide-in-from-bottom-2">
                    {error}
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống? Hành động này không thể hoàn tác."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                confirmText="Xóa tài khoản"
            />
        </div>
    );
};
