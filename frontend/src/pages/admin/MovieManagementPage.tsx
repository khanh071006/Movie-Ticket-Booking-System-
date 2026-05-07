import { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Movie } from '../../types/app';

const emptyMovie = {
    title: '',
    description: '',
    durationMinutes: 120,
    releaseDate: '',
    language: '',
    posterUrl: '',
    trailerUrl: '',
};

export const MovieManagementPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState(emptyMovie);
    const [editId, setEditId] = useState<string | null>(null);

    const loadMovies = () => {
        apiClient.movies.getAll().then(setMovies).catch((err) => setError(parseError(err)));
    };

    useEffect(() => {
        loadMovies();
    }, []);

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return movies;
        return movies.filter((m) => m.title.toLowerCase().includes(q));
    }, [movies, query]);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            const payload = { ...form, durationMinutes: Number(form.durationMinutes) || 1 };
            if (editId) {
                await apiClient.movies.update(editId, payload);
            } else {
                await apiClient.movies.create(payload);
            }
            setForm(emptyMovie);
            setEditId(null);
            loadMovies();
        } catch (err) {
            setError(parseError(err));
        }
    };

    const startEdit = (movie: Movie) => {
        setEditId(movie.id);
        setForm({
            title: movie.title,
            description: movie.description,
            durationMinutes: movie.durationMinutes,
            releaseDate: movie.releaseDate,
            language: movie.language,
            posterUrl: movie.posterUrl,
            trailerUrl: movie.trailerUrl,
        });
    };

    const onDelete = async (id: string) => {
        if (!confirm('Xóa phim này?')) return;
        try {
            await apiClient.movies.remove(id);
            loadMovies();
        } catch (err) {
            setError(parseError(err));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Movies</h1>
                    <p className="mt-1 text-slate-500">CRUD endpoint `/api/v1/movies` (GET công khai, còn lại ADMIN).</p>
                </div>
            </div>

            <Card className="p-4">
                <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-4">
                    <Input placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
                    <Input placeholder="Duration (minutes)" type="number" value={String(form.durationMinutes)} onChange={(e) => setForm((p) => ({ ...p, durationMinutes: Number(e.target.value) }))} required />
                    <Input placeholder="Release date (YYYY-MM-DD)" type="date" value={form.releaseDate} onChange={(e) => setForm((p) => ({ ...p, releaseDate: e.target.value }))} required />
                    <Input placeholder="Language" value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))} required />
                    <Input className="md:col-span-2" placeholder="Poster URL" value={form.posterUrl} onChange={(e) => setForm((p) => ({ ...p, posterUrl: e.target.value }))} />
                    <Input className="md:col-span-2" placeholder="Trailer URL" value={form.trailerUrl} onChange={(e) => setForm((p) => ({ ...p, trailerUrl: e.target.value }))} />
                    <Input className="md:col-span-4" placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                    <div className="md:col-span-4 flex items-center gap-2">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            {editId ? 'Update Movie' : 'Add Movie'}
                        </Button>
                        {editId && (
                            <Button type="button" variant="outline" className="text-slate-600" onClick={() => { setEditId(null); setForm(emptyMovie); }}>
                                Cancel edit
                            </Button>
                        )}
                    </div>
                </form>
            </Card>

            <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b bg-slate-50 p-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input className="bg-white pl-9" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Movie</th>
                                <th className="px-6 py-4 font-medium">Duration</th>
                                <th className="px-6 py-4 font-medium">Release Date</th>
                                <th className="px-6 py-4 font-medium">Language</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rows.map((movie) => (
                                <tr key={movie.id} className="bg-white hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={movie.posterUrl} alt="" className="h-14 w-10 rounded object-cover" />
                                            <div className="font-medium text-slate-900">{movie.title}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{movie.durationMinutes} min</td>
                                    <td className="px-6 py-4 text-slate-500">{formatDate(movie.releaseDate)}</td>
                                    <td className="px-6 py-4 text-slate-500">{movie.language}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => startEdit(movie)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600" onClick={() => onDelete(movie.id)}>
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
    const formatDate = (value: string) => new Date(value).toLocaleDateString('vi-VN');
