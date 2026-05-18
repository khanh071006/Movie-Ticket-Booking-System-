import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { apiClient } from '../../api/axiosClient';
import type { Cinema, Movie, Showtime } from '../../types/app';
import { Button } from '../../components/ui/Button';

export const CinemasPage = () => {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [cinemaMovies, setCinemaMovies] = useState<Record<string, Movie[]>>({});
    const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [cinemasData, moviesData] = await Promise.all([
                    apiClient.cinemas.getAll(),
                    apiClient.movies.getAll(),
                ]);
                setCinemas(cinemasData);

                // Fetch showtimes for all movies to see which cinema they are showing at
                const showtimesPromises = moviesData.map(movie => 
                    apiClient.showtimes.getByMovie(movie.id).catch(() => [] as Showtime[])
                );
                const showtimesArray = await Promise.all(showtimesPromises);

                const movieCinemaMap: Record<string, Set<string>> = {}; 
                // cinemaId -> Set of movieIds

                cinemasData.forEach(c => {
                    movieCinemaMap[c.id] = new Set();
                });

                moviesData.forEach((movie, index) => {
                    const showtimes = showtimesArray[index];
                    if (showtimes && showtimes.length > 0) {
                        showtimes.forEach(st => {
                            const cId = st.room?.cinema?.id;
                            if (cId && movieCinemaMap[cId]) {
                                movieCinemaMap[cId].add(movie.id);
                            }
                        });
                    }
                });

                const cinemaMoviesData: Record<string, Movie[]> = {};
                cinemasData.forEach(c => {
                    cinemaMoviesData[c.id] = moviesData.filter(m => movieCinemaMap[c.id].has(m.id));
                });

                setCinemaMovies(cinemaMoviesData);
                if (cinemasData.length > 0) {
                    setSelectedCinemaId(cinemasData[0].id);
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const selectedCinema = cinemas.find(c => c.id === selectedCinemaId);
    const displayedMovies = selectedCinemaId ? (cinemaMovies[selectedCinemaId] || []) : [];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20 text-white">
            <div className="container mx-auto px-6 md:px-12">
                <h1 className="mb-8 text-4xl font-bold uppercase tracking-tighter text-blue-500">
                    Hệ Thống Rạp Chiếu
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar: Cinemas List */}
                    <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
                        {cinemas.map(cinema => (
                            <div
                                key={cinema.id}
                                onClick={() => setSelectedCinemaId(cinema.id)}
                                className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
                                    selectedCinemaId === cinema.id
                                        ? 'border-blue-500 bg-blue-600/20 text-white'
                                        : 'border-white/10 bg-[#141414] text-gray-400 hover:border-white/30 hover:bg-[#1f1f1f]'
                                }`}
                            >
                                <h3 className="font-bold text-lg mb-1">{cinema.name}</h3>
                                <p className="text-sm flex items-start gap-1">
                                    <MapPin size={14} className="mt-1 flex-shrink-0" />
                                    <span className="line-clamp-2">{cinema.address}</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Main Content: Selected Cinema & Movies */}
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        {selectedCinema ? (
                            <div>
                                <div className="mb-8 rounded-2xl bg-[#141414] p-6 border border-white/10">
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedCinema.name}</h2>
                                    <p className="text-gray-400 flex items-center gap-2">
                                        <MapPin size={18} className="text-blue-500" />
                                        {selectedCinema.address}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold tracking-tight">Phim đang chiếu tại rạp</h3>
                                    <div className="h-1.5 w-16 rounded-full bg-blue-600 mb-6" />

                                    {displayedMovies.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
                                            {displayedMovies.map((movie) => (
                                                <Link
                                                    key={movie.id}
                                                    to={`/movies/${movie.id}`}
                                                    className="group flex flex-col transition-all duration-300 hover:-translate-y-2"
                                                >
                                                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/5 shadow-2xl">
                                                        {movie.posterUrl ? (
                                                            <img
                                                                src={movie.posterUrl}
                                                                alt={movie.title}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-[#1A1A1A] text-gray-600">
                                                                No Poster
                                                            </div>
                                                        )}
                                                        {/* Language Badge */}
                                                        <div className="absolute left-3 top-3 rounded border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                                                            {movie.language}
                                                        </div>
                                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-blue-900/90 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <Button size="sm" className="w-full font-bold shadow-lg">
                                                                Chi tiết
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 space-y-1">
                                                        <h3 className="line-clamp-1 text-base font-bold transition-colors group-hover:text-blue-500">
                                                            {movie.title}
                                                        </h3>
                                                        <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={12} className="text-blue-500" /> {movie.durationMinutes}m
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center bg-[#141414] rounded-xl border border-white/5">
                                            <p className="text-gray-400">Hiện chưa có phim nào đang chiếu tại rạp này.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-[#141414] text-gray-500">
                                Vui lòng chọn một rạp để xem phim
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
