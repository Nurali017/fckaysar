import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CartSummaryProps {
    selectedSeats: any[];
    onRemoveSeat: (index: number) => void;
    onCheckout: () => void;
}

export const CartSummary = ({ selectedSeats, onRemoveSeat, onCheckout }: CartSummaryProps) => {
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Сіздің билеттеріңіз</h3>

            {selectedSeats.length === 0 ? (
                <div className="text-zinc-500 text-center py-8">
                    Билеттер таңдалмаған
                </div>
            ) : (
                <div className="space-y-4 mb-8">
                    {selectedSeats.map((seat, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <div>
                                <div className="text-sm font-bold text-white">Сектор {seat.sectorId}</div>
                                <div className="text-xs text-zinc-400">Қатар {seat.row}, Орын {seat.number}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-red-500">{seat.price} ₸</span>
                                <button
                                    onClick={() => onRemoveSeat(idx)}
                                    className="text-zinc-600 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t border-zinc-800 pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold text-white">
                    <span>Жалпы сома:</span>
                    <span>{total} ₸</span>
                </div>
                <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6"
                    disabled={selectedSeats.length === 0}
                    onClick={onCheckout}
                >
                    Сатып алу
                </Button>
            </div>
        </div>
    );
};
