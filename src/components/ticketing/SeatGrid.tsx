import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SeatGridProps {
    sectorId: string;
    price: number;
    onSeatSelect: (seat: { row: number; number: number; price: number }) => void;
    selectedSeats: { row: number; number: number }[];
}

export const SeatGrid = ({ sectorId, price, onSeatSelect, selectedSeats }: SeatGridProps) => {
    const rows = 8;
    const seatsPerRow = 12;

    const isSelected = (r: number, s: number) => {
        return selectedSeats.some(seat => seat.row === r && seat.number === s);
    };

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Орын таңдау: {sectorId}</h3>
                <span className="text-red-500 font-bold">{price} ₸</span>
            </div>

            <div className="flex flex-col gap-2 items-center overflow-x-auto pb-4">
                {/* Screen/Field direction */}
                <div className="w-full max-w-md h-1 bg-gradient-to-r from-transparent via-zinc-600 to-transparent mb-8 relative">
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 uppercase tracking-widest">Алаң</span>
                </div>

                {Array.from({ length: rows }).map((_, rowIdx) => {
                    const rowNum = rowIdx + 1;
                    return (
                        <div key={rowNum} className="flex gap-2 items-center">
                            <span className="text-xs text-zinc-600 w-6 text-right">{rowNum}</span>
                            <div className="flex gap-1">
                                {Array.from({ length: seatsPerRow }).map((_, seatIdx) => {
                                    const seatNum = seatIdx + 1;
                                    const selected = isSelected(rowNum, seatNum);
                                    // Randomly disable some seats to simulate occupancy
                                    const occupied = (rowNum * seatNum * 13) % 7 === 0;

                                    return (
                                        <button
                                            key={seatNum}
                                            disabled={occupied}
                                            onClick={() => onSeatSelect({ row: rowNum, number: seatNum, price })}
                                            className={`
                                                w-8 h-8 rounded-t-lg text-[10px] font-medium transition-all
                                                ${occupied
                                                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                                    : selected
                                                        ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)] scale-110'
                                                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                                }
                                            `}
                                        >
                                            {seatNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <span className="text-xs text-zinc-600 w-6">{rowNum}</span>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center gap-6 mt-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-zinc-700 rounded-t-sm"></div>
                    <span>Бос</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded-t-sm"></div>
                    <span>Таңдалған</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-zinc-800 rounded-t-sm"></div>
                    <span>Бос емес</span>
                </div>
            </div>
        </div>
    );
};
