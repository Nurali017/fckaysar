/**
 * CMS Types - TypeScript types for Payload CMS collections
 */

// Media type (used by uploads)
export interface CMSMedia {
  id: string;
  alt: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

// News collection
export interface CMSNews {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: CMSRichText;
  featuredImage: CMSMedia | string;
  gallery?: (CMSMedia | string)[];
  category: 'news' | 'match-report' | 'transfers' | 'interview';
  tags?: { tag: string }[];
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Player collection
export interface CMSPlayer {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  jerseyNumber?: number;
  photo?: CMSMedia | string;
  actionPhotos?: (CMSMedia | string)[];
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  displayName: string;
  position?: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  nationality?: string;
  biography?: CMSRichText;
  statistics?: CMSPlayerStats[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
  status: 'active' | 'injured' | 'loaned';
  createdAt: string;
  updatedAt: string;
}

export interface CMSPlayerStats {
  season: string;
  appearances?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
}

// Gallery collection
export interface CMSGallery {
  id: string;
  title: string;
  description?: string;
  media: (CMSMedia | string)[];
  type: 'photo' | 'video';
  category?: 'match' | 'training' | 'event';
  relatedMatch?: string;
  uploadDate?: string;
  featured: boolean;
  tags?: { tag: string }[];
  createdAt: string;
  updatedAt: string;
}

// Leadership collection
export interface CMSLeadership {
  id: string;
  key: 'owner' | 'head_coach' | 'sporting_director';
  photo: CMSMedia | string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payload CMS Rich Text type
export interface CMSRichText {
  root: {
    type: string;
    children: CMSRichTextNode[];
    direction: 'ltr' | 'rtl' | null;
    format: string;
    indent: number;
    version: number;
  };
}

export interface CMSRichTextNode {
  type: string;
  version: number;
  children?: CMSRichTextNode[];
  text?: string;
  format?: number;
  mode?: string;
  style?: string;
  detail?: number;
  tag?: string;
  direction?: 'ltr' | 'rtl' | null;
  indent?: number;
  listType?: string;
}

// Payload API Response types
export interface CMSPaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Query parameters
export interface CMSQueryParams {
  limit?: number;
  page?: number;
  sort?: string;
  where?: Record<string, unknown>;
  depth?: number;
  locale?: string;
}

// Transformed types for frontend use
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  publishedAt: string;
  featured: boolean;
}

export interface PlayerItem {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  slug: string;
  number?: number;
  photoUrl?: string;
  position?: string;
  positionKey?: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  nationality?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  biography?: string;
  stats?: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
  status: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  images: string[];
  type: 'photo' | 'video';
  category?: string;
  uploadDate: string;
  featured: boolean;
  tags: string[];
}

export interface LeadershipItem {
  id: string;
  key: string;
  photoUrl: string;
  order: number;
}

// Poll collection
export interface CMSPoll {
  id: string;
  question: string;
  slug: string;
  description?: string;
  options: CMSPollOption[];
  totalVotes: number;
  status: 'active' | 'closed' | 'draft';
  featured: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSPollOption {
  optionText: string;
  votes: number;
  id?: string;
}

// Transformed types for frontend
export interface PollItem {
  id: string;
  question: string;
  slug: string;
  description?: string;
  options: PollOptionItem[];
  totalVotes: number;
  status: 'active' | 'closed' | 'draft';
  featured: boolean;
}

export interface PollOptionItem {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

// Infrastructure collection
export interface CMSInfrastructure {
  id: string;
  name: string;
  type: 'stadium' | 'training_base' | 'academy' | 'office';
  status: 'active' | 'construction' | 'planned';
  description?: CMSRichText;
  shortDescription?: string;
  mainImage?: CMSMedia | string;
  gallery?: (CMSMedia | string)[];
  features?: {
    title: string;
    description: string;
  }[];
  address?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  capacity?: number;
  uefaCategory?: '1' | '2' | '3' | '4';
  fieldType?: string;
  lightingLux?: number;
  parkingSpaces?: number;
  fieldsCount?: number;
  yearBuilt?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Infrastructure transformed type for frontend
export interface InfrastructureItem {
  id: string;
  name: string;
  type: 'stadium' | 'training_base' | 'academy' | 'office';
  status: 'active' | 'construction' | 'planned';
  description?: string;
  shortDescription?: string;
  mainImageUrl?: string;
  galleryUrls: string[];
  features: {
    title: string;
    description: string;
  }[];
  address?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  capacity?: number;
  uefaCategory?: string;
  fieldType?: string;
  lightingLux?: number;
  parkingSpaces?: number;
  fieldsCount?: number;
  yearBuilt?: number;
}

// Match collection from CMS
export interface CMSMatch {
  id: string;
  sotaId: string;
  seasonId: number;
  tour: number;

  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    logo: string;
    score?: number;
    brandColor: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    logo: string;
    score?: number;
    brandColor: string;
  };

  matchDate: string;
  venue?: string;
  competition?: string;
  visitors?: number;
  status: 'scheduled' | 'live' | 'finished';
  hasStats: boolean;

  teamStats?: {
    home: {
      possession?: number;
      shots?: number;
      shotsOnGoal?: number;
      shotsOffGoal?: number;
      passes?: number;
      fouls?: number;
      corners?: number;
      offsides?: number;
      yellowCards?: number;
      redCards?: number;
    };
    away: {
      possession?: number;
      shots?: number;
      shotsOnGoal?: number;
      shotsOffGoal?: number;
      passes?: number;
      fouls?: number;
      corners?: number;
      offsides?: number;
      yellowCards?: number;
      redCards?: number;
    };
  };

  referees?: {
    main?: string;
    firstAssistant?: string;
    secondAssistant?: string;
    fourthReferee?: string;
    var?: string;
    varAssistant?: string;
  };

  homeLineup?: Array<{
    playerId: string;
    number: number;
    fullName: string;
    lastName: string;
    isGk: boolean;
    isCaptain: boolean;
    photo?: string;
  }>;
  awayLineup?: Array<{
    playerId: string;
    number: number;
    fullName: string;
    lastName: string;
    isGk: boolean;
    isCaptain: boolean;
    photo?: string;
  }>;

  homeCoach?: { name: string; photo?: string };
  awayCoach?: { name: string; photo?: string };

  homePlayers?: Array<{
    playerId: string;
    name: string;
    number: number;
    shots?: number;
    shotsOnGoal?: number;
    passes?: number;
    fouls?: number;
    yellowCards?: number;
    redCards?: number;
    duels?: number;
    tackles?: number;
    offsides?: number;
    corners?: number;
  }>;
  awayPlayers?: Array<{
    playerId: string;
    name: string;
    number: number;
    shots?: number;
    shotsOnGoal?: number;
    passes?: number;
    fouls?: number;
    yellowCards?: number;
    redCards?: number;
    duels?: number;
    tackles?: number;
    offsides?: number;
    corners?: number;
  }>;

  highlights?: CMSMedia | string;
  gallery?: (CMSMedia | string)[];
  ticketLink?: string;
  matchReport?: CMSRichText;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Achievement collection
export interface CMSAchievement {
  id: string;
  title: string;
  type: 'championship' | 'cup' | 'eurocup' | 'award' | 'other';
  year: number;
  place?: '1' | '2' | '3' | 'finalist' | 'semifinalist' | 'participant';
  competition?: string;
  description?: CMSRichText;
  image?: CMSMedia | string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Achievement transformed type for frontend
export interface AchievementItem {
  id: string;
  title: string;
  type: 'championship' | 'cup' | 'eurocup' | 'award' | 'other';
  year: number;
  place?: string;
  competition?: string;
  description?: string;
  imageUrl?: string;
}

// Veteran collection
export interface CMSVeteran {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  position?: 'goalkeeper' | 'defender' | 'midfielder' | 'forward' | 'coach';
  yearsInClub?: string;
  jerseyNumber?: number;
  photo?: CMSMedia | string;
  achievements?: string;
  biography?: CMSRichText;
  statistics?: {
    matches?: number;
    goals?: number;
    assists?: number;
  };
  isLegend: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Veteran transformed type for frontend
export interface VeteranItem {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  position?: string;
  positionKey?: 'goalkeeper' | 'defender' | 'midfielder' | 'forward' | 'coach';
  yearsInClub?: string;
  jerseyNumber?: number;
  photoUrl?: string;
  achievements?: string;
  biography?: string;
  statistics?: {
    matches: number;
    goals: number;
    assists: number;
  };
  isLegend: boolean;
}
