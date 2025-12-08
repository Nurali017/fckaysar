export interface PlayerStats {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets?: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed?: number;
    // V2 данные для радарной диаграммы
    shots?: number;
    shotsOnGoal?: number;
    passes?: number;
    duels?: number;
    tackles?: number;
}

export interface PlayerItem {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    number?: number;
    photoUrl?: string;
    position: string;
    positionKey: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
    nationality: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
    stats?: PlayerStats;
    status: 'active' | 'injured' | 'suspended';
}

// New types for enhanced player profile visualization
export interface RadarData {
    key: string;
    subject: string;
    value: number;
    fullMark: 100;
    description: string;
}

export interface DerivedStats {
    goalsPerGame: number;
    assistsPerGame: number;
    minutesPerGame: number;
    cleanSheetRate: number;
    disciplineScore: number;
}

export type PlayerForm = 'hot' | 'good' | 'average' | 'cold';

export interface PlayerFormData {
    form: PlayerForm;
    formScore: number;
    trend: 'up' | 'down' | 'stable';
}
