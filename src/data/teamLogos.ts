/**
 * Team logos mapping for Kazakhstan Premier League teams
 * Generates SVG logos with team colors and initials
 */

interface TeamInfo {
  name: string;
  initials: string;
  primaryColor: string;
  secondaryColor: string;
}

// KPL Teams with their brand colors
const KPL_TEAMS: Record<number, TeamInfo> = {
  // FC Kaisar (Kyzylorda) - Red/White
  94: { name: 'Kaisar', initials: 'КСР', primaryColor: '#DC2626', secondaryColor: '#FFFFFF' },
  // FC Astana - Yellow/Blue
  85: { name: 'Astana', initials: 'АСТ', primaryColor: '#2563EB', secondaryColor: '#FBBF24' },
  // FC Kairat (Almaty) - Yellow/Black
  86: { name: 'Kairat', initials: 'КРТ', primaryColor: '#FBBF24', secondaryColor: '#1F2937' },
  // FC Ordabasy (Shymkent) - Green/White
  87: { name: 'Ordabasy', initials: 'ОРД', primaryColor: '#16A34A', secondaryColor: '#FFFFFF' },
  // FC Tobol (Kostanay) - Blue/White
  88: { name: 'Tobol', initials: 'ТБЛ', primaryColor: '#1D4ED8', secondaryColor: '#FFFFFF' },
  // FC Aktobe - Red/White
  89: { name: 'Aktobe', initials: 'АКТ', primaryColor: '#B91C1C', secondaryColor: '#FFFFFF' },
  // FC Shakhter (Karaganda) - Orange/Black
  90: { name: 'Shakhter', initials: 'ШХТ', primaryColor: '#EA580C', secondaryColor: '#1F2937' },
  // FC Atyrau - Green/White
  91: { name: 'Atyrau', initials: 'АТР', primaryColor: '#059669', secondaryColor: '#FFFFFF' },
  // FC Zhenis (Astana) - Blue/White
  92: { name: 'Zhenis', initials: 'ЖНС', primaryColor: '#3B82F6', secondaryColor: '#FFFFFF' },
  // FC Kyzylzhar (Petropavlovsk) - Red/Black
  93: { name: 'Kyzylzhar', initials: 'КЖР', primaryColor: '#EF4444', secondaryColor: '#1F2937' },
  // FC Maktaaral - Blue/Yellow
  95: { name: 'Maktaaral', initials: 'МКТ', primaryColor: '#2563EB', secondaryColor: '#FCD34D' },
  // FC Turan - Green/Yellow
  96: { name: 'Turan', initials: 'ТРН', primaryColor: '#15803D', secondaryColor: '#FDE047' },
  // FC Aksu - Blue/White
  97: { name: 'Aksu', initials: 'АКС', primaryColor: '#0284C7', secondaryColor: '#FFFFFF' },
  // FC Ekibastuz - Blue/White
  98: { name: 'Ekibastuz', initials: 'ЕКБ', primaryColor: '#1E40AF', secondaryColor: '#FFFFFF' },
  // FC Caspiy (Aktau) - Blue/White
  99: { name: 'Caspiy', initials: 'КСП', primaryColor: '#0891B2', secondaryColor: '#FFFFFF' },
  // FC Zhetysu (Taldykorgan) - Green/White
  100: { name: 'Zhetysu', initials: 'ЖТС', primaryColor: '#22C55E', secondaryColor: '#FFFFFF' },
  // FC Taraz - Yellow/Blue
  101: { name: 'Taraz', initials: 'ТРЗ', primaryColor: '#EAB308', secondaryColor: '#1E3A8A' },
  // FC Elimai - Blue/White
  102: { name: 'Elimai', initials: 'ЕЛМ', primaryColor: '#3730A3', secondaryColor: '#FFFFFF' },
  // FC Okzhetpes - Blue/White
  103: { name: 'Okzhetpes', initials: 'ОКЖ', primaryColor: '#1E40AF', secondaryColor: '#FFFFFF' },
};

// Name patterns for fuzzy matching
const TEAM_NAME_PATTERNS: Record<string, number> = {
  'кайсар': 94, 'kaysar': 94, 'kaisar': 94, 'qaisar': 94,
  'астана': 85, 'astana': 85,
  'кайрат': 86, 'kairat': 86, 'qairat': 86,
  'ордабасы': 87, 'ordabasy': 87,
  'тобол': 88, 'tobol': 88, 'tobyl': 88,
  'актобе': 89, 'aktobe': 89, 'aqtobe': 89,
  'шахтер': 90, 'shakhter': 90, 'shakhtyor': 90, 'караганд': 90, 'karaganda': 90,
  'атырау': 91, 'atyrau': 91,
  'женис': 92, 'жеңіс': 92, 'zhenis': 92,
  'кызылжар': 93, 'kyzylzhar': 93, 'қызылжар': 93,
  'мактаарал': 95, 'maktaaral': 95,
  'туран': 96, 'turan': 96,
  'аксу': 97, 'aksu': 97, 'ақсу': 97,
  'экибастуз': 98, 'ekibastuz': 98,
  'каспий': 99, 'caspiy': 99, 'каспiй': 99,
  'жетысу': 100, 'zhetysu': 100,
  'тараз': 101, 'taraz': 101,
  'елімай': 102, 'elimai': 102,
  'окжетпес': 103, 'okzhetpes': 103,
};

/**
 * Generate SVG logo as data URL
 */
const generateTeamLogoSvg = (info: TeamInfo): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${info.primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(info.primaryColor, -30)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#grad)" stroke="${info.secondaryColor}" stroke-width="3"/>
      <text x="50" y="58" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="${info.secondaryColor}" text-anchor="middle">${info.initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Adjust color brightness
 */
const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Generate generic placeholder logo
 */
const generatePlaceholderLogo = (teamName: string): string => {
  const initials = teamName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3) || '?';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#374151" stroke="#6B7280" stroke-width="2"/>
      <text x="50" y="58" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#E5E7EB" text-anchor="middle">${initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Get team ID by name (fuzzy match)
 */
const getTeamIdByName = (teamName: string): number | null => {
  const normalizedName = teamName.toLowerCase().trim();

  // Direct match
  if (TEAM_NAME_PATTERNS[normalizedName]) {
    return TEAM_NAME_PATTERNS[normalizedName];
  }

  // Partial match
  for (const [pattern, id] of Object.entries(TEAM_NAME_PATTERNS)) {
    if (normalizedName.includes(pattern) || pattern.includes(normalizedName)) {
      return id;
    }
  }

  return null;
};

/**
 * Get team logo - tries ID first, then name, then returns placeholder
 */
export const getTeamLogo = (teamId: number, teamName: string): string => {
  // Try by ID first
  if (KPL_TEAMS[teamId]) {
    return generateTeamLogoSvg(KPL_TEAMS[teamId]);
  }

  // Try by name
  const foundId = getTeamIdByName(teamName);
  if (foundId && KPL_TEAMS[foundId]) {
    return generateTeamLogoSvg(KPL_TEAMS[foundId]);
  }

  // Return placeholder
  return generatePlaceholderLogo(teamName);
};

/**
 * Get team info by ID
 */
export const getTeamInfo = (teamId: number): TeamInfo | null => {
  return KPL_TEAMS[teamId] || null;
};

/**
 * FC Kaisar team ID constant
 */
export const FC_KAISAR_TEAM_ID = 94;
