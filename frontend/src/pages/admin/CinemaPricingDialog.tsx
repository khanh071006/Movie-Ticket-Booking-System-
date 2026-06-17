import { useEffect, useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { apiClient, parseError } from '../../api/axiosClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { SeatType, TicketType } from '../../types/app';

interface CinemaPricingDialogProps {
    cinemaId: number;
    cinemaName: string;
    isOpen: boolean;
    onClose: () => void;
}

export const CinemaPricingDialog = ({ cinemaId, cinemaName, isOpen, onClose }: CinemaPricingDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);

    // Form state
    const [ticketPrices, setTicketPrices] = useState<Record<number, number>>({});
    const [seatPrices, setSeatPrices] = useState<Record<number, number>>({});

    useEffect(() => {
        if (!isOpen || !cinemaId) return;

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const [ttRes, stRes, pRes] = await Promise.all([
                    apiClient.ticketTypes.getAll(),
                    apiClient.seatTypes.getAll(),
                    apiClient.cinemas.getPricing(cinemaId)
                ]);

                setTicketTypes(ttRes);
                setSeatTypes(stRes);

                // Initialize form state
                const tpMap: Record<number, number> = {};
                ttRes.forEach(tt => {
                    const existing = pRes.ticketPrices?.find(p => p.ticketTypeId === tt.id);
                    tpMap[tt.id] = existing ? existing.price : tt.basePrice;
                });
                setTicketPrices(tpMap);

                const spMap: Record<number, number> = {};
                stRes.forEach(st => {
                    const existing = pRes.seatPrices?.find(p => p.seatTypeId === st.id);
                    spMap[st.id] = existing ? existing.surcharge : 0;
                });
                setSeatPrices(spMap);

            } catch (err) {
                setError(parseError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, cinemaId]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const payload = {
                ticketPrices: Object.entries(ticketPrices).map(([id, price]) => ({
                    ticketTypeId: Number(id),
                    price: Number(price)
                })),
                seatPrices: Object.entries(seatPrices).map(([id, surcharge]) => ({
                    seatTypeId: Number(id),
                    surcharge: Number(surcharge)
                }))
            };

            await apiClient.cinemas.updatePricing(cinemaId, payload);
            onClose();
        } catch (err) {
            setError(parseError(err));
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Bảng giá Rạp</h2>
                        <p className="text-sm text-blue-400">{cinemaName}</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-slate-500">Đang tải dữ liệu...</div>
                ) : (
                    <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        {/* Ticket Prices Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-white/10 pb-2">
                                🎟️ Giá Loại Vé (Base Price)
                            </h3>
                            <div className="grid gap-4">
                                {ticketTypes.map(tt => (
                                    <div key={tt.id} className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-200">{tt.name}</div>
                                            <div className="text-xs text-slate-500">Mặc định hệ thống: {tt.basePrice.toLocaleString()}đ</div>
                                        </div>
                                        <div className="w-40 relative">
                                            <Input
                                                type="text"
                                                className="pr-8 text-right bg-white/5 border-white/10 !text-green-400 !font-bold focus:!text-white focus:border-blue-500 transition-colors"
                                                value={ticketPrices[tt.id] !== undefined ? ticketPrices[tt.id].toLocaleString('vi-VN') : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setTicketPrices(p => ({ ...p, [tt.id]: val ? Number(val) : 0 }));
                                                }}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">đ</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Seat Surcharge Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-white/10 pb-2">
                                💺 Phụ thu Loại Ghế (Surcharge)
                            </h3>
                            <div className="grid gap-4">
                                {seatTypes.map(st => (
                                    <div key={st.id} className="flex items-center justify-between gap-4">
                                        <div className="flex-1 font-medium text-slate-200">{st.name}</div>
                                        <div className="w-40 relative">
                                            <Input
                                                type="text"
                                                className="pr-8 text-right bg-white/5 border-white/10 !text-green-400 !font-bold focus:!text-white focus:border-blue-500 transition-colors"
                                                value={seatPrices[st.id] !== undefined ? seatPrices[st.id].toLocaleString('vi-VN') : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setSeatPrices(p => ({ ...p, [st.id]: val ? Number(val) : 0 }));
                                                }}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">đ</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button variant="ghost" onClick={onClose} disabled={saving} className="text-slate-400 hover:text-white">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={loading || saving} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Save className="h-4 w-4" />
                        {saving ? 'Đang lưu...' : 'Lưu Bảng Giá'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
