import { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Cinema, Room } from '../../types/app';

export const RoomManagementPage = () => {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [selectedCinemaId, setSelectedCinemaId] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [name, setName] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        apiClient.cinemas.getAll().then((res) => {
            setCinemas(res);
            if (res.length) setSelectedCinemaId(res[0].id);
        });
    }, []);

    const loadRooms = (cinemaId: string) => {
        if (!cinemaId) return;
        apiClient.rooms.getByCinema(cinemaId).then(setRooms).catch((err) => setError(parseError(err)));
    };

    useEffect(() => {
        loadRooms(selectedCinemaId);
    }, [selectedCinemaId]);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (!selectedCinemaId) return;
            if (editId) await apiClient.rooms.update(editId, { name, cinemaId: selectedCinemaId });
            else await apiClient.rooms.create({ name, cinemaId: selectedCinemaId });
            setName('');
            setEditId(null);
            loadRooms(selectedCinemaId);
        } catch (err) {
            setError(parseError(err));
        }
    };

    const remove = async (id: string) => {
        if (!confirm('Xóa phòng này?')) return;
        try {
            await apiClient.rooms.remove(id);
            loadRooms(selectedCinemaId);
        } catch (err) {
            setError(parseError(err));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rooms</h1>
                <p className="mt-1 text-slate-500">Quản lý `/api/v1/rooms` theo từng rạp.</p>
            </div>
            <Card className="p-4">
                <div className="mb-3 grid gap-3 md:grid-cols-2">
                    <select
                        className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
                        value={selectedCinemaId}
                        onChange={(e) => setSelectedCinemaId(e.target.value)}
                    >
                        {cinemas.map((cinema) => (
                            <option key={cinema.id} value={cinema.id}>
                                {cinema.name}
                            </option>
                        ))}
                    </select>
                </div>
                <form onSubmit={submit} className="flex flex-wrap items-center gap-3">
                    <Input placeholder="Room name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        {editId ? 'Update Room' : 'Add Room'}
                    </Button>
                    {editId && (
                        <Button type="button" variant="outline" className="text-slate-600" onClick={() => { setEditId(null); setName(''); }}>
                            Cancel
                        </Button>
                    )}
                </form>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Room name</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rooms.map((room) => (
                                <tr key={room.id} className="bg-white">
                                    <td className="px-6 py-4 font-medium text-slate-900">{room.name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => { setEditId(room.id); setName(room.name); }}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => remove(room.id)}>
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
