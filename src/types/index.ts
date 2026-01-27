export interface Match {
  id: string;
  homeTeam: {
    name: string;
    logo: string;
    score?: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    score?: number;
  };
  date: string;
  rawDate?: string;
  time: string;
  tour?: number;
  stadium: string;
  league: string;
  status: 'upcoming' | 'live' | 'finished';
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  slug: string;
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets?: number; // For goalkeepers
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

export interface Player {
  id: string;
  name: string;
  nameKz: string;
  number: number;
  position: string;
  positionKz: string;
  positionKey?: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  photo: string;
  nationality: string;
  age: number;
  height?: number; // in cm
  weight?: number; // in kg
  birthDate?: string;
  birthPlace?: string;
  bio?: string;
  bioKz?: string;
  stats?: PlayerStats;
  previousClubs?: string[];
  contractUntil?: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  date: string;
}
