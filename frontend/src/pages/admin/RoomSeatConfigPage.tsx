import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, LayoutGrid, X } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { SeatType } from '../../types/app';

// Helper functions for Grid mapping
const indexToLetter = (index: number) => String.fromCharCode(65 + index); // 0 -> A, 1 -> B
const letterToIndex = (letter: string) => letter.charCodeAt(0) - 65;

export const RoomSeatConfigPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
    const [rows, setRows] = useState<number>(10);
    const [cols, setCols] = useState<number>(14);
    
    // Matrix of seatTypeId (null means no seat)
    const [grid, setGrid] = useState<(number | null)[][]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const loadData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const types = await apiClient.seatTypes.getAll();
            setSeatTypes(types);
            if (types.length > 0) setSelectedTypeId(types[0].id);

            const existingSeats = await apiClient.rooms.getSeats(id);
            
            // Reconstruct grid from existing seats
            if (existingSeats.length > 0) {
                let maxR = 0;
                let maxC = 0;
                
                existingSeats.forEach(seat => {
                    const match = seat.seatLocation.match(/^([A-Z]+)(\d+)$/);
                    if (match) {
                        const r = letterToIndex(match[1]);
                        const c = parseInt(match[2], 10) - 1;
                        if (r > maxR) maxR = r;
                        if (c > maxC) maxC = c;
                    }
                });
                
                const newRows = Math.max(10, maxR + 1);
                const newCols = Math.max(14, maxC + 1);
                setRows(newRows);
                setCols(newCols);
                
                const newGrid: (number | null)[][] = Array(newRows).fill(null).map(() => Array(newCols).fill(null));
                existingSeats.forEach(seat => {
                    const match = seat.seatLocation.match(/^([A-Z]+)(\d+)$/);
                    if (match) {
                        const r = letterToIndex(match[1]);
                        const c = parseInt(match[2], 10) - 1;
                        newGrid[r][c] = seat.seatTypeId;
                    }
                });
                setGrid(newGrid);
            } else {
                // Empty grid
                setGrid(Array(10).fill(null).map(() => Array(14).fill(null)));
            }
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleResize = () => {
        const newGrid: (number | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
        for (let r = 0; r < Math.min(rows, grid.length); r++) {
            for (let c = 0; c < Math.min(cols, grid[r].length); c++) {
                newGrid[r][c] = grid[r][c];
            }
        }
        setGrid(newGrid);
    };

    const handleCellClick = (r: number, c: number) => {
        const newGrid = [...grid];
        newGrid[r] = [...newGrid[r]];
        // Toggle if same type, otherwise set new type
        if (newGrid[r][c] === selectedTypeId) {
            newGrid[r][c] = null; // Xóa ghế
        } else {
            newGrid[r][c] = selectedTypeId; // Đặt ghế
        }
        setGrid(newGrid);
    };

    const handleSave = async () => {
        if (!id) return;
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const payload: { seatLocation: string; seatTypeId: number }[] = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (grid[r][c] !== null) {
                        payload.push({
                            seatLocation: `${indexToLetter(r)}${c + 1}`,
                            seatTypeId: grid[r][c] as number,
                            roomId: Number(id)
                        });
                    }
                }
            }
            await apiClient.rooms.configureSeats(id, payload);
            setSuccessMsg('Đã lưu cấu hình ghế thành công!');
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    // Helper for seat colors
    const getSeatColorClass = (typeId: number | null) => {
        if (typeId === null) return 'bg-zinc-800 border-zinc-700 hover:border-zinc-500';
        // Assign colors dynamically based on index or hardcode common ones
        const index = seatTypes.findIndex(t => t.id === typeId);
        const colors = [
            'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]', // Loại 1
            'bg-purple-500 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]', // VIP
            'bg-pink-500 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)]', // Couple
            'bg-orange-500 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]', // Khác
            'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
        ];
        return colors[index % colors.length] || 'bg-blue-500';
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                    <span className="cursor-pointer hover:underline" onClick={() => navigate('/admin/rooms')}>Phòng chiếu</span>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-400">Sơ đồ ghế</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white italic">
                    CẤU HÌNH <span className="text-blue-600">GHẾ</span>
                </h1>
            </div>

            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                    {error}
                </div>
            )}
            
            {successMsg && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
                    {successMsg}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Panel: Settings & Palette */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-white/10 bg-zinc-900/50 p-6 backdrop-blur-md">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <LayoutGrid className="text-blue-500" size={18} /> Lưới không gian
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Số Hàng</label>
                                    <Input 
                                        type="number" min="1" max="26"
                                        className="h-10 border-white/10 bg-white/5 text-white" 
                                        value={rows} onChange={(e) => setRows(Number(e.target.value))} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Số Cột</label>
                                    <Input 
                                        type="number" min="1" max="50"
                                        className="h-10 border-white/10 bg-white/5 text-white" 
                                        value={cols} onChange={(e) => setCols(Number(e.target.value))} 
                                    />
                                </div>
                            </div>
                            <Button variant="outline" className="w-full text-slate-300 border-white/10" onClick={handleResize}>
                                Áp dụng lưới
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-white/10 bg-zinc-900/50 p-6 backdrop-blur-md">
                        <h3 className="font-bold text-white mb-4">Loại ghế (Bảng màu)</h3>
                        <p className="text-xs text-slate-500 mb-4">Chọn loại ghế bên dưới rồi bấm vào màn hình lưới để vẽ.</p>
                        <div className="space-y-3">
                            {seatTypes.map((type) => (
                                <div 
                                    key={type.id} 
                                    onClick={() => setSelectedTypeId(type.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                                        selectedTypeId === type.id 
                                        ? 'bg-white/10 border-white/20 shadow-lg' 
                                        : 'bg-white/5 border-transparent hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-md border ${getSeatColorClass(type.id)}`} />
                                    <span className="font-semibold text-sm text-slate-200">{type.name}</span>
                                </div>
                            ))}
                            <div 
                                onClick={() => setSelectedTypeId(null)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                                    selectedTypeId === null 
                                    ? 'bg-red-500/10 border-red-500/20 shadow-lg' 
                                    : 'bg-white/5 border-transparent hover:bg-red-500/10'
                                }`}
                            >
                                <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                    <X size={14} className="text-red-500" />
                                </div>
                                <span className="font-semibold text-sm text-red-400">Xóa ghế (Trống)</span>
                            </div>
                        </div>
                    </Card>

                    <Button onClick={handleSave} disabled={loading} className="w-full h-12 gap-2 font-bold shadow-xl shadow-blue-900/20">
                        <Save size={18} /> Lưu Sơ Đồ
                    </Button>
                </div>

                {/* Right Panel: The Grid */}
                <div className="lg:col-span-9">
                    <Card className="border-white/10 bg-zinc-900/50 p-8 backdrop-blur-md overflow-x-auto custom-scrollbar flex flex-col items-center">
                        {/* Screen curve indicator */}
                        <div className="w-3/4 h-8 border-t-4 border-blue-500/30 rounded-[50%] mb-12 relative flex justify-center">
                            <span className="absolute -top-3 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-zinc-900 px-4">Màn hình</span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            {grid.map((rowArr, r) => (
                                <div key={r} className="flex gap-2 items-center">
                                    <div className="w-6 font-bold text-xs text-slate-600 text-right pr-2">
                                        {indexToLetter(r)}
                                    </div>
                                    {rowArr.map((cellType, c) => (
                                        <div 
                                            key={`${r}-${c}`}
                                            onClick={() => handleCellClick(r, c)}
                                            className={`w-8 h-8 rounded-t-lg rounded-b-sm border cursor-pointer flex items-center justify-center text-[10px] font-bold transition-all ${getSeatColorClass(cellType)} hover:brightness-125`}
                                            title={`${indexToLetter(r)}${c + 1}`}
                                        >
                                            {cellType !== null ? c + 1 : ''}
                                        </div>
                                    ))}
                                    <div className="w-6 font-bold text-xs text-slate-600 pl-2">
                                        {indexToLetter(r)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
