import { useEffect, useState } from 'react';
import { getMovies } from '../../features/movies/api/movieApi';
import type { Movie } from '../../features/movies/types';

export const MovieManagementPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await getMovies();
            setMovies(data);
        };
        load();
    }, []);

    return (
        <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6">
            <h1 className="mb-4 text-xl font-bold text-white">Quản lý phim</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-left text-[#A3A3A3]">
                            <th className="px-3 py-2">Tiêu đề</th>
                            <th className="px-3 py-2">Ngày phát hành</th>
                            <th className="px-3 py-2">Thời lượng</th>
                            <th className="px-3 py-2">Ngôn ngữ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id} className="border-b border-white/5">
                                <td className="px-3 py-2 text-white">{movie.title}</td>
                                <td className="px-3 py-2 text-[#A3A3A3]">{movie.releaseDate}</td>
                                <td className="px-3 py-2 text-[#A3A3A3]">{movie.durationMinutes} phút</td>
                                <td className="px-3 py-2 text-[#A3A3A3]">{movie.language}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
