import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Plus, ChevronRight, ArrowLeft } from 'lucide-react';
import { apiClient, parseError } from '../../../api/axiosClient';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { CategorySelect } from '../../../components/ui/CategorySelect';

const emptyMovie = {
    title: '',
    description: '',
    durationMinutes: 120,
    ageRestriction: 0,
    releaseDate: '',
    language: '',
    posterUrl: '',
    trailerUrl: '',
    directorId: '',
    movieStatusId: '',
    castMemberIds: [] as string[],
    genreIds: [] as string[],
};

export const MovieFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState(emptyMovie);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadMovie(id);
        }
    }, [id]);

    const loadMovie = async (movieId: string) => {
        setLoading(true);
        try {
            const movie = await apiClient.movies.getById(movieId);
            setForm({
                title: movie.title,
                description: movie.description,
                durationMinutes: movie.durationMinutes,
                ageRestriction: movie.ageRestriction || 0,
                releaseDate: movie.releaseDate,
                language: movie.language,
                posterUrl: movie.posterUrl,
                trailerUrl: movie.trailerUrl,
                directorId: movie.director?.id || '',
                movieStatusId: movie.movieStatus?.id || '',
                castMemberIds: movie.castMembers?.map((c) => c.id) || [],
                genreIds: movie.genres?.map((g) => g.id) || [],
            });
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = { ...form, durationMinutes: Number(form.durationMinutes) || 1 };
            if (id) {
                await apiClient.movies.update(id, payload);
            } else {
                await apiClient.movies.create(payload);
            }
            navigate('/manager/movies');
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2 cursor-pointer hover:text-white w-fit transition-colors" onClick={() => navigate('/manager/movies')}>
                    <ArrowLeft className="h-4 w-4" />
                    <span>Quay lại danh sách</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                    <span>Admin</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span>Phim</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-400">{id ? 'Cập nhật' : 'Thêm mới'}</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    {id ? 'CẬP NHẬT ' : 'THÊM '}
                    <span className="text-blue-600">PHIM</span>
                </h1>
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 animate-in slide-in-from-bottom-2">
                    {error}
                </div>
            )}

            {/* Form Section */}
            <Card className="overflow-hidden border-white/10 bg-zinc-900/50 p-0 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-white/5 bg-white/5 px-6 py-4">
                    <div className="rounded-lg bg-blue-600/20 p-2 text-blue-500">
                        {id ? <Edit2 size={20} /> : <Plus size={20} />}
                    </div>
                    <h2 className="text-lg font-bold text-white">
                        {id ? 'Cập nhật thông tin phim' : 'Thêm phim mới vào hệ thống'}
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

                        <div className="md:col-span-1 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Giới hạn tuổi</label>
                            <select
                                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={form.ageRestriction}
                                onChange={(e) => setForm((p) => ({ ...p, ageRestriction: Number(e.target.value) }))}
                            >
                                <option value={0} className="bg-zinc-900">P - Phổ biến</option>
                                <option value={13} className="bg-zinc-900">T13 - Từ 13 tuổi</option>
                                <option value={16} className="bg-zinc-900">T16 - Từ 16 tuổi</option>
                                <option value={18} className="bg-zinc-900">T18 - Từ 18 tuổi</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Đạo diễn</label>
                            <CategorySelect 
                                kind="directors" 
                                value={form.directorId} 
                                onChange={(val) => setForm((p) => ({ ...p, directorId: val }))} 
                            />
                        </div>

                        <div className="md:col-span-1 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Trạng thái</label>
                            <CategorySelect 
                                kind="movie-statuses" 
                                value={form.movieStatusId} 
                                onChange={(val) => setForm((p) => ({ ...p, movieStatusId: val }))} 
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Thể loại</label>
                            <CategorySelect 
                                kind="genres" 
                                isMulti 
                                value={form.genreIds} 
                                onChange={(val) => setForm((p) => ({ ...p, genreIds: val }))} 
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Diễn viên</label>
                            <CategorySelect 
                                kind="cast-members" 
                                isMulti 
                                value={form.castMemberIds} 
                                onChange={(val) => setForm((p) => ({ ...p, castMemberIds: val }))} 
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Link ảnh Poster</label>
                            <Input 
                                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-blue-500" 
                                placeholder="https://example.com/poster.jpg" 
                                value={form.posterUrl} 
                                onChange={(e) => setForm((p) => ({ ...p, posterUrl: e.target.value }))} 
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Link Trailer</label>
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
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="h-11 px-6 text-slate-400 hover:text-white" 
                            onClick={() => navigate('/manager/movies')}
                            disabled={loading}
                        >
                            Huỷ
                        </Button>
                        <Button disabled={loading} className="h-11 px-10 font-bold shadow-xl shadow-blue-900/20 gap-2">
                            {id ? <Edit2 size={18} /> : <Plus size={18} />}
                            {loading ? 'Đang xử lý...' : (id ? 'Cập nhật phim' : 'Xác nhận thêm phim')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
