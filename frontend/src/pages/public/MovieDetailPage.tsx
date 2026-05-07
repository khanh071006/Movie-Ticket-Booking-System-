import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Globe, MapPin, Play, Ticket } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import { Button } from '../../components/ui/Button';
import type { Cinema, Movie, Showtime } from '../../types/app';

export const MovieDetailPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [showtimes, setShowtimes] = useState<Record<string, Showtime[]>>({});

    useEffect(() => {
        if (!id) return;
        apiClient.movies.getById(id).then(setMovie).catch(() => setMovie(null));
        apiClient.cinemas.getAll().then((res) => {
            setCinemas(res);
            res.forEach((cinema) => {
                apiClient.showtimes.getByMovieAndCinema(id, cinema.id).then((list) => {
                    setShowtimes((prev) => ({ ...prev, [cinema.id]: list }));
                });
            });
        });
    }, [id]);

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formatTime = (value: string) => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    if (!movie) {
        return <div className="flex min-h-[50vh] items-center justify-center text-slate-400">Không tìm thấy phim hoặc chưa có dữ liệu.</div>;
    }

    return (
        <div className="pb-24">
            <div className="relative mb-12 h-[50vh] min-h-[400px] w-full lg:mb-24">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
                <img src={movie.posterUrl} alt={movie.title} className="absolute inset-0 h-full w-full object-cover opacity-30 blur-sm" />
                <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-12 lg:translate-y-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-end gap-8 md:flex-row md:items-stretch lg:gap-12">
                            <div className="hidden aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50 md:block md:w-64 lg:w-80">
                                <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-6 pb-4 md:pb-0">
                                <div className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">Đang chiếu</div>
                                <h1 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-7xl">{movie.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-300 md:text-base">
                                    <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                                        <Clock className="h-4 w-4 text-blue-400" /> {movie.durationMinutes} min
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                                        <Calendar className="h-4 w-4 text-blue-400" /> {formatDate(movie.releaseDate)}
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                                        <Globe className="h-4 w-4 text-blue-400" /> {movie.language}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pt-2">
                                    <Button size="lg" className="h-12 rounded-full bg-blue-600 px-8 text-white hover:bg-blue-500">
                                        <Ticket className="mr-2 h-5 w-5" />
                                        Đặt vé ngay
                                    </Button>
                                    <a href={movie.trailerUrl} target="_blank" rel="noreferrer">
                                        <Button size="lg" variant="outline" className="h-12 rounded-full border-white/20 bg-transparent px-8 text-white">
                                            <Play className="mr-2 h-5 w-5" />
                                            Xem trailer
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-24 px-4 lg:mt-32">
                <div className="grid gap-12 md:grid-cols-3">
                    <div className="space-y-12 md:col-span-2">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight text-white">Nội dung phim</h2>
                            <p className="text-lg font-light leading-relaxed text-slate-400">{movie.description}</p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white">Lịch chiếu</h2>
                                <div className="rounded-lg border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-400">
                                    Hôm nay, {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                </div>
                            </div>
                            <div className="space-y-6">
                                {cinemas.map((cinema) => {
                                    const cinemaShowtimes = showtimes[cinema.id] || [];
                                    if (!cinemaShowtimes.length) return null;
                                    return (
                                        <div key={cinema.id} className="overflow-hidden rounded-2xl border border-white/5 bg-[#111111]">
                                            <div className="flex flex-col justify-between gap-4 border-b border-white/5 bg-white/[0.02] p-6 md:flex-row md:items-center">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-bold text-white">{cinema.name}</h3>
                                                    <p className="flex items-center gap-1.5 text-sm text-slate-500">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {cinema.address}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                                                    {cinemaShowtimes.map((st) => (
                                                        <button key={st.id} className="group flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-blue-500 hover:bg-blue-600">
                                                            <span className="text-lg font-semibold text-white">{formatTime(st.startTime)}</span>
                                                            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-100">
                                                                {st.room?.name ?? 'Phòng chiếu'}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 md:col-span-1">
                        <div className="rounded-2xl border border-white/5 bg-[#111111] p-6">
                            <h3 className="mb-4 font-bold tracking-tight text-white">Thông tin phim</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-sm text-slate-500">Ngôn ngữ</p>
                                    <p className="font-medium text-slate-300">{movie.language}</p>
                                </div>
                                <div className="h-px w-full bg-white/5" />
                                <div>
                                    <p className="mb-1 text-sm text-slate-500">Thời lượng</p>
                                    <p className="font-medium text-slate-300">{movie.durationMinutes} phút</p>
                                </div>
                                <div className="h-px w-full bg-white/5" />
                                <div>
                                    <p className="mb-1 text-sm text-slate-500">Ngày khởi chiếu</p>
                                    <p className="font-medium text-slate-300">{movie.releaseDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
