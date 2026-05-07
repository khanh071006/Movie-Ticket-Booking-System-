import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { Cinema, Movie, Room, Showtime } from '../../types/app';

export const ShowtimeManagementPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [movieId, setMovieId] = useState('');
    const [cinemaId, setCinemaId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([apiClient.movies.getAll(), apiClient.cinemas.getAll()])
            .then(([m, c]) => {
                setMovies(m);
                setCinemas(c);
                if (m.length) setMovieId(m[0].id);
                if (c.length) setCinemaId(c[0].id);
            })
            .catch((err) => setError(parseError(err)));
    }, []);

    useEffect(() => {
        if (!cinemaId) return;
        apiClient.rooms.getByCinema(cinemaId).then((res) => {
            setRooms(res);
            if (res.length) setRoomId(res[0].id);
        });
    }, [cinemaId]);

    const loadShowtimes = useCallback(() => {
        if (!movieId || !cinemaId) return;
        apiClient.showtimes.getByMovieAndCinema(movieId, cinemaId).then(setShowtimes).catch((err) => setError(parseError(err)));
    }, [cinemaId, movieId]);

    useEffect(() => {
        loadShowtimes();
    }, [loadShowtimes]);

    const selectedMovie = useMemo(() => movies.find((m) => m.id === movieId), [movies, movieId]);

    const onCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await apiClient.showtimes.create({ movieId, roomId, startTime });
            setStartTime('');
            loadShowtimes();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const onDelete = async (id: string) => {
        if (!confirm('Xóa lịch chiếu này?')) return;
        try {
            await apiClient.showtimes.remove(id);
            loadShowtimes();
        } catch (err) {
            setError(parseError(err));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Showtimes</h1>
                <p className="mt-1 text-slate-500">Khai thác API `/api/v1/showtimes` gồm create/list/delete.</p>
            </div>
            <Card className="p-4">
                <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-4">
                    <select className="h-9 rounded-md border border-slate-300 px-3 text-sm" value={movieId} onChange={(e) => setMovieId(e.target.value)}>
                        {movies.map((movie) => (
                            <option key={movie.id} value={movie.id}>
                                {movie.title}
                            </option>
                        ))}
                    </select>
                    <select className="h-9 rounded-md border border-slate-300 px-3 text-sm" value={cinemaId} onChange={(e) => setCinemaId(e.target.value)}>
                        {cinemas.map((cinema) => (
                            <option key={cinema.id} value={cinema.id}>
                                {cinema.name}
                            </option>
                        ))}
                    </select>
                    <select className="h-9 rounded-md border border-slate-300 px-3 text-sm" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <input className="h-9 flex-1 rounded-md border border-slate-300 px-3 text-sm" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add
                        </Button>
                    </div>
                </form>
            </Card>

            <Card className="overflow-hidden">
                <div className="border-b bg-slate-50 px-6 py-4 text-sm text-slate-600">
                    Movie: <span className="font-semibold text-slate-900">{selectedMovie?.title ?? '-'}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Start Time</th>
                                <th className="px-6 py-4 font-medium">Room</th>
                                <th className="px-6 py-4 font-medium">Cinema</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {showtimes.map((st) => (
                                <tr key={st.id} className="bg-white">
                                    <td className="px-6 py-4 text-slate-700">{new Date(st.startTime).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-700">{st.room?.name ?? '-'}</td>
                                    <td className="px-6 py-4 text-slate-700">{st.room?.cinema?.name ?? '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => onDelete(st.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
