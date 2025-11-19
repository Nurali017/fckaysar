export const HeatmapWidget = () => {
    // Mock heatmap data - higher values indicate more activity
    const heatmapData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 2, 3, 3, 2, 1, 0, 0],
        [0, 1, 2, 4, 5, 5, 4, 2, 1, 0],
        [0, 1, 3, 6, 8, 8, 6, 3, 1, 0],
        [0, 1, 3, 6, 8, 8, 6, 3, 1, 0],
        [0, 1, 2, 4, 5, 5, 4, 2, 1, 0],
        [0, 0, 1, 2, 3, 3, 2, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const getHeatColor = (value: number) => {
        if (value === 0) return 'rgba(255, 255, 255, 0.02)';
        if (value <= 2) return 'rgba(239, 68, 68, 0.2)'; // light red
        if (value <= 4) return 'rgba(239, 68, 68, 0.4)';
        if (value <= 6) return 'rgba(239, 68, 68, 0.6)';
        return 'rgba(239, 68, 68, 0.9)'; // intense red
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-white mb-6">Алаңдағы белсенділік картасы</h2>

            <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-lg p-8 relative overflow-hidden">
                {/* Field markings */}
                <svg className="w-full h-auto max-w-4xl mx-auto" viewBox="0 0 700 1050" fill="none">
                    {/* Outer boundary */}
                    <rect x="50" y="50" width="600" height="950" stroke="white" strokeWidth="3" fill="none" opacity="0.3" />

                    {/* Center line */}
                    <line x1="50" y1="525" x2="650" y2="525" stroke="white" strokeWidth="2" opacity="0.3" />

                    {/* Center circle */}
                    <circle cx="350" cy="525" r="80" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
                    <circle cx="350" cy="525" r="3" fill="white" opacity="0.3" />

                    {/* Penalty areas */}
                    <rect x="50" y="50" width="600" height="150" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
                    <rect x="50" y="850" width="600" height="150" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />

                    {/* Goal areas */}
                    <rect x="200" y="50" width="300" height="60" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
                    <rect x="200" y="940" width="300" height="60" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />

                    {/* Heatmap overlay */}
                    {heatmapData.map((row, y) => (
                        row.map((value, x) => (
                            <rect
                                key={`${x}-${y}`}
                                x={50 + x * 60}
                                y={50 + y * 95}
                                width="60"
                                height="95"
                                fill={getHeatColor(value)}
                                className="transition-all duration-300"
                            />
                        ))
                    ))}
                </svg>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-6">
                    <span className="text-white text-sm">Аз белсенділік</span>
                    <div className="flex gap-1">
                        {[0.2, 0.4, 0.6, 0.9].map((opacity, idx) => (
                            <div
                                key={idx}
                                className="w-8 h-4 rounded"
                                style={{ backgroundColor: `rgba(239, 68, 68, ${opacity})` }}
                            ></div>
                        ))}
                    </div>
                    <span className="text-white text-sm">Жоғары белсенділік</span>
                </div>
            </div>
        </div>
    );
};
