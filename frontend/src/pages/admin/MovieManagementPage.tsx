import { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Search, Trash2, Clapperboard, Clock, Globe, Calendar, Image as ImageIcon, Film, ChevronRight } from 'lucide-react';
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
    const [loading, setLoading] = useState(false);

    const formatDate = (value: string) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const loadMovies = async () => {
        setLoading(true);
        try {
            const data = await apiClient.movies.getAll();
            setMovies(data);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
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
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bộ phim này?')) return;
        try {
            await apiClient.movies.remove(id);
            loadMovies();
        } catch (err) {
            setError(parseError(err));
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                    <span>Admin</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-400">Content</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    QUẢN LÝ <span className="text-blue-600">PHIM</span>
                </h1>
                <p className="text-slate-400">Cập nhật kho phim, poster và thông tin chi tiết cho khán giả.</p>
            </div>

            {/* Form Section */}
            <Card className="overflow-hidden border-white/10 bg-zinc-900/50 p-0 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-white/5 bg-white/5 px-6 py-4">
                    <div className="rounded-lg bg-blue-600/20 p-2 text-blue-500">
                        {editId ? <Edit2 size={20} /> : <Plus size={20} />}
                    </div>
                    <h2 className="text-lg font-bold text-white">
                        {editId ? 'Cập nhật thông tin phim' : 'Thêm phim mới vào hệ thống'}
                    </h2>
                </div>
                
                <form onSubmit={onSubmit} className="p-6">
                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tên phim</label>
                            <Input 
                                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                placeholder="VD: Avengers: Endgame" 
                                value={form.title} 
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Thời lượng (phút)</label>
                            <Input 
                                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                type="number" 
                                value={String(form.durationMinutes)} 
                                onChange={(e) => setForm((p) => ({ ...p, durationMinutes: Number(e.target.value) }))} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Ngôn ngữ</label>
                            <Input 
                                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                placeholder="Tiếng Anh, Phụ đề VN" 
                                value={form.language} 
                                onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))} 
                                required 
                            />
                        </div>

                        <div className="md:col-span-1 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Ngày khởi chiếu</label>
                            <Input 
                                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500 [color-scheme:dark]" 
                                type="date" 
                                value={form.releaseDate} 
                                onChange={(e) => setForm((p) => ({ ...p, releaseDate: e.target.value }))} 
                                required 
                            />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Link ảnh Poster</label>
                            <Input 
                                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                placeholder="https://example.com/poster.jpg" 
                                value={form.posterUrl} 
                                onChange={(e) => setForm((p) => ({ ...p, posterUrl: e.target.value }))} 
                            />
                        </div>

                        <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Link Trailer (Youtube)</label>
                            <Input 
                                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                placeholder="https://youtube.com/watch?v=..." 
                                value={form.trailerUrl} 
                                onChange={(e) => setForm((p) => ({ ...p, trailerUrl: e.target.value }))} 
                            />
                        </div>

                        <div className="md:col-span-4 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Mô tả nội dung</label>
                            <textarea 
                                className="min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                                placeholder="Nhập tóm tắt nội dung phim..." 
                                value={form.description} 
                                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} 
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/5 pt-6">
                        {editId && (
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="h-11 px-6 text-slate-400 hover:text-white" 
                                onClick={() => { setEditId(null); setForm(emptyMovie); }}
                            >
                                Huỷ chỉnh sửa
                            </Button>
                        )}
                        <Button className="h-11 px-10 font-bold shadow-xl shadow-blue-900/20 gap-2">
                            {editId ? <Edit2 size={18} /> : <Plus size={18} />}
                            {editId ? 'Cập nhật phim' : 'Xác nhận thêm phim'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* List Section */}
            <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clapperboard className="text-blue-500" />
                        Danh sách phim ({rows.length})
                    </h3>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <Input 
                            className="h-10 border-white/10 bg-zinc-900 pl-10 text-white placeholder:text-slate-600 focus:border-blue-500" 
                            placeholder="Tìm kiếm theo tên..." 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                        />
                    </div>
                </div>

                <Card className="overflow-hidden border-white/10 bg-zinc-900/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Thông tin phim</th>
                                    <th className="px-6 py-4 font-bold">Chi tiết</th>
                                    <th className="px-6 py-4 font-bold">Ngôn ngữ</th>
                                    <th className="px-6 py-4 text-right font-bold">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rows.length > 0 ? (
                                    rows.map((movie) => (
                                        <tr key={movie.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-lg">
                                                        {movie.posterUrl ? (
                                                            <img src={movie.posterUrl} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-white/5 text-slate-700">
                                                                <ImageIcon size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">{movie.title}</div>
                                                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                                            <Calendar size={12} />
                                                            {formatDate(movie.releaseDate)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <Clock size={12} className="text-blue-500" />
                                                        {movie.durationMinutes} phút
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <Film size={12} className="text-blue-500" />
                                                        {movie.trailerUrl ? 'Có Trailer' : 'Chưa có Trailer'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300 border border-white/10">
                                                    {movie.language}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-500/10" onClick={() => startEdit(movie)}>
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-500/10" onClick={() => onDelete(movie.id)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-600 italic">
                                            {loading ? 'Đang tải danh sách phim...' : 'Không tìm thấy bộ phim nào.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 animate-in slide-in-from-bottom-2">
                    {error}
                </div>
            )}
        </div>
    );
};
