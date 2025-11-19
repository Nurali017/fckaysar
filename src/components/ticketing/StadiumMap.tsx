import { useState } from "react";

interface StadiumMapProps {
    onSectorSelect: (sectorId: string) => void;
    selectedSector: string | null;
}

export const StadiumMap = ({ onSectorSelect, selectedSector }: StadiumMapProps) => {
    const sectors = [
        { id: "A1", name: "Сектор A1", price: 2000, type: "standard", path: "M150 150 L250 150 L230 250 L170 250 Z" },
        { id: "A2", name: "Сектор A2", price: 2000, type: "standard", path: "M255 150 L355 150 L335 250 L235 250 Z" },
        { id: "VIP", name: "VIP Ложа", price: 15000, type: "vip", path: "M360 150 L460 150 L440 250 L340 250 Z" },
        { id: "B1", name: "Сектор B1", price: 2000, type: "standard", path: "M465 150 L565 150 L545 250 L445 250 Z" },
        { id: "B2", name: "Сектор B2", price: 2000, type: "standard", path: "M570 150 L670 150 L650 250 L550 250 Z" },

        // Bottom sectors
        { id: "C1", name: "Сектор C1", price: 1500, type: "standard", path: "M170 350 L230 350 L250 450 L150 450 Z" },
        { id: "C2", name: "Сектор C2", price: 1500, type: "standard", path: "M235 350 L335 350 L355 450 L255 450 Z" },
        { id: "FAN", name: "Фан-Сектор", price: 1000, type: "fan", path: "M340 350 L440 350 L460 450 L360 450 Z" },
        { id: "D1", name: "Сектор D1", price: 1500, type: "standard", path: "M445 350 L545 350 L565 450 L465 450 Z" },
        { id: "D2", name: "Сектор D2", price: 1500, type: "standard", path: "M550 350 L650 350 L670 450 L570 450 Z" },
    ];

    return (
        <div className="relative w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 p-4 md:p-8">
            <div className="overflow-x-auto pb-4">
                <svg viewBox="0 0 800 600" className="w-full min-w-[600px] h-auto drop-shadow-2xl">
                    {/* Field */}
                    <rect x="100" y="260" width="600" height="80" fill="#166534" rx="4" />
                    <rect x="100" y="260" width="600" height="80" stroke="white" strokeWidth="2" fill="none" opacity="0.3" rx="4" />
                    <circle cx="400" cy="300" r="10" fill="white" opacity="0.3" />
                    <line x1="400" y1="260" x2="400" y2="340" stroke="white" strokeWidth="2" opacity="0.3" />

                    {/* Sectors */}
                    {sectors.map((sector) => {
                        const isSelected = selectedSector === sector.id;
                        let fillColor = "#3f3f46"; // zinc-700
                        if (sector.type === "vip") fillColor = "#fbbf24"; // amber-400
                        if (sector.type === "fan") fillColor = "#ef4444"; // red-500
                        if (isSelected) fillColor = "#ffffff";

                        return (
                            <g
                                key={sector.id}
                                onClick={() => onSectorSelect(sector.id)}
                                className="cursor-pointer transition-all duration-300 hover:opacity-80"
                                style={{ transformOrigin: 'center', transform: isSelected ? 'scale(1.05)' : 'scale(1)' }}
                            >
                                <path
                                    d={sector.path}
                                    fill={fillColor}
                                    stroke="black"
                                    strokeWidth="2"
                                    className={isSelected ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : ""}
                                />
                                <text
                                    x={getCenter(sector.path).x}
                                    y={getCenter(sector.path).y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="black"
                                    fontSize="12"
                                    fontWeight="bold"
                                    className="pointer-events-none"
                                >
                                    {sector.id}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-zinc-700 rounded-sm"></div>
                        <span>Стандарт</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                        <span>VIP</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        <span>Фан-сектор</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper to find center of path (simplified)
const getCenter = (path: string) => {
    const coords = path.match(/\d+/g)?.map(Number) || [];
    const x = coords.filter((_, i) => i % 2 === 0);
    const y = coords.filter((_, i) => i % 2 === 1);
    return {
        x: x.reduce((a, b) => a + b, 0) / x.length,
        y: y.reduce((a, b) => a + b, 0) / y.length
    };
};
