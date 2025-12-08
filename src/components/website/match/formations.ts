export type Position = {
    x: number; // Percentage from left (0-100)
    y: number; // Percentage from top (0-100)
    role?: string; // Optional role name for debugging
};

export type Formation = {
    name: string;
    positions: Position[]; // Array of 11 positions (GK + 10 outfield)
};

// Standard formations
// Coordinates are percentage based: x (0=left, 100=right), y (0=top, 100=bottom)
// We define them for a team playing "Bottom to Top" (Home)
// For Away team (Top to Bottom), we will flip the Y coordinates

export const FORMATIONS: Record<string, Formation> = {
    '4-3-3': {
        name: '4-3-3',
        positions: [
            { x: 50, y: 90, role: 'GK' }, // GK
            { x: 20, y: 75, role: 'LB' }, { x: 40, y: 75, role: 'CB' }, { x: 60, y: 75, role: 'CB' }, { x: 80, y: 75, role: 'RB' }, // Defenders
            { x: 30, y: 55, role: 'CM' }, { x: 50, y: 55, role: 'CDM' }, { x: 70, y: 55, role: 'CM' }, // Midfielders
            { x: 20, y: 30, role: 'LW' }, { x: 50, y: 25, role: 'ST' }, { x: 80, y: 30, role: 'RW' }, // Forwards
        ]
    },
    '4-4-2': {
        name: '4-4-2',
        positions: [
            { x: 50, y: 90, role: 'GK' },
            { x: 20, y: 75, role: 'LB' }, { x: 40, y: 75, role: 'CB' }, { x: 60, y: 75, role: 'CB' }, { x: 80, y: 75, role: 'RB' },
            { x: 15, y: 50, role: 'LM' }, { x: 38, y: 50, role: 'CM' }, { x: 62, y: 50, role: 'CM' }, { x: 85, y: 50, role: 'RM' },
            { x: 35, y: 25, role: 'ST' }, { x: 65, y: 25, role: 'ST' },
        ]
    },
    '4-2-3-1': {
        name: '4-2-3-1',
        positions: [
            { x: 50, y: 90, role: 'GK' },
            { x: 20, y: 75, role: 'LB' }, { x: 40, y: 75, role: 'CB' }, { x: 60, y: 75, role: 'CB' }, { x: 80, y: 75, role: 'RB' },
            { x: 35, y: 60, role: 'CDM' }, { x: 65, y: 60, role: 'CDM' },
            { x: 20, y: 40, role: 'LAM' }, { x: 50, y: 40, role: 'CAM' }, { x: 80, y: 40, role: 'RAM' },
            { x: 50, y: 20, role: 'ST' },
        ]
    },
    '3-5-2': {
        name: '3-5-2',
        positions: [
            { x: 50, y: 90, role: 'GK' },
            { x: 30, y: 75, role: 'CB' }, { x: 50, y: 75, role: 'CB' }, { x: 70, y: 75, role: 'CB' },
            { x: 15, y: 50, role: 'LWB' }, { x: 35, y: 55, role: 'CM' }, { x: 50, y: 50, role: 'CM' }, { x: 65, y: 55, role: 'CM' }, { x: 85, y: 50, role: 'RWB' },
            { x: 35, y: 25, role: 'ST' }, { x: 65, y: 25, role: 'ST' },
        ]
    },
    '3-4-3': {
        name: '3-4-3',
        positions: [
            { x: 50, y: 90, role: 'GK' },
            { x: 30, y: 75, role: 'CB' }, { x: 50, y: 75, role: 'CB' }, { x: 70, y: 75, role: 'CB' },
            { x: 15, y: 50, role: 'LM' }, { x: 40, y: 50, role: 'CM' }, { x: 60, y: 50, role: 'CM' }, { x: 85, y: 50, role: 'RM' },
            { x: 20, y: 25, role: 'LW' }, { x: 50, y: 20, role: 'ST' }, { x: 80, y: 25, role: 'RW' },
        ]
    }
};

export const DEFAULT_FORMATION = FORMATIONS['4-3-3'];

export const getFormation = (formationName: string = '4-3-3'): Formation => {
    return FORMATIONS[formationName] || DEFAULT_FORMATION;
};
