import { useEffect, useState } from 'react';
import axios from 'axios';
import { getStoredToken } from '../../features/auth/utils/session';

interface ApiResponse<T> {
    data: T;
}

interface Account {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    roles?: string[];
}

const adminApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
});

export const AccountManagementPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        const load = async () => {
            const token = getStoredToken();
            const response = await adminApi.get<ApiResponse<Account[]>>('/accounts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAccounts(response.data.data);
        };
        load();
    }, []);

    return (
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
            <h1 className="mb-4 text-xl font-bold text-white">Quản lý tài khoản</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-left text-[#A3A3A3]">
                            <th className="px-3 py-2">Họ tên</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">SĐT</th>
                            <th className="px-3 py-2">Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id} className="border-b border-white/5">
                                <td className="px-3 py-2 text-white">{account.fullName}</td>
                                <td className="px-3 py-2 text-[#A3A3A3]">{account.email}</td>
                                <td className="px-3 py-2 text-[#A3A3A3]">{account.phone || '-'}</td>
                                <td className="px-3 py-2 text-[#A3A3A3]">{account.roles?.join(', ') || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
