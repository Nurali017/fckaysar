import type {
  PlayerStats,
  RadarData,
  DerivedStats,
  PlayerForm,
  PlayerFormData,
} from '@/types/player';

type PositionKey = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

// Helper function to clamp values between min and max
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Normalize value to 0-100 scale
const normalize = (value: number, max: number): number => {
  return Math.min(100, (value / max) * 100);
};

/**
 * ============================================================================
 * RADAR CHART - 5 АТРИБУТОВ НА ОСНОВЕ SOTA V2 API
 * ============================================================================
 *
 * НОРМАТИВЫ АДАПТИРОВАНЫ ПОД КПЛ (Казахстан Премьер Лига)
 * На основе реальных данных ФК Кайсар сезон 2025
 *
 * Средние показатели команды:
 * - Голов/игра: 0.055 | Топ (Жаксылыков): 0.32
 * - Ассистов/игра: 0.019 | Топ (Махан): 0.15
 * - Пасов/игра: 17.2 | Топ (Кенесбек): 36.7
 * - Единоборств/игра: 5.5 | Топ (Жаксылыков): 13.8
 * - Отборов/игра: 0.47 | Топ (Абикен): 1.36
 *
 * ФОРМУЛЫ РАСЧЕТА (100% = топ-уровень КПЛ):
 *
 * 1. SHOOTING: 40% точность + 60% голы/игра (0.35 = 100%)
 * 2. PASSING: 70% пасы/игра (35 = 100%) + 30% ассисты/игра (0.15 = 100%)
 * 3. DEFENSE: 60% отборы/игра (1.5 = 100%) + 40% сухие матчи
 * 4. ATTACK: (голы + ассисты) / игра (0.4 = 100%)
 * 5. DUELS: единоборства/игра (14 = 100%)
 *
 * ============================================================================
 */
export const calculateRadarStats = (stats: PlayerStats): RadarData[] => {
  const appearances = stats.appearances || 1;
  const goals = stats.goals || 0;
  const assists = stats.assists || 0;
  const shots = stats.shots || 0;
  const shotsOnGoal = stats.shotsOnGoal || 0;
  const passes = stats.passes || 0;
  const tackles = stats.tackles || 0;
  const duels = stats.duels || 0;
  const cleanSheets = stats.cleanSheets || 0;

  // Handle edge case: no appearances
  if (!stats.appearances || stats.appearances === 0) {
    return [
      { key: 'shooting', subject: 'Shooting', value: 50, fullMark: 100, description: 'Shot accuracy & goals' },
      { key: 'passing', subject: 'Passing', value: 50, fullMark: 100, description: 'Passes & assists' },
      { key: 'defense', subject: 'Defense', value: 50, fullMark: 100, description: 'Tackles & clean sheets' },
      { key: 'attack', subject: 'Attack', value: 50, fullMark: 100, description: 'Goals & assists' },
      { key: 'duels', subject: 'Duels', value: 50, fullMark: 100, description: 'Duels per game' },
    ];
  }

  // 1. SHOOTING: 40% точность ударов + 60% голы/игра
  // КПЛ норматив: 0.35 гола/игра = 100% (Жаксылыков = топ с 0.32)
  const shotAccuracy = shots > 0 ? (shotsOnGoal / shots) * 100 : 50;
  const goalsPerGame = normalize(goals / appearances, 0.35);
  const shooting = clamp(shotAccuracy * 0.4 + goalsPerGame * 0.6, 20, 95);

  // 2. PASSING: 70% передачи/игра + 30% ассисты/игра
  // КПЛ норматив: 35 пасов/игра = 100%, 0.15 ассистов/игра = 100%
  const passesPerGame = passes / appearances;
  const assistsPerGame = normalize(assists / appearances, 0.15);
  const passing = clamp(normalize(passesPerGame, 35) * 0.7 + assistsPerGame * 0.3, 25, 95);

  // 3. DEFENSE: 60% отборы + 40% сухие матчи
  // КПЛ норматив: 1.5 отбора/игра = 100% (топ защитники ~1.3)
  const tacklesPerGame = normalize(tackles / appearances, 1.5);
  const cleanSheetRate = normalize(cleanSheets / appearances, 0.3); // 30% сухих матчей = 100%
  const defense = clamp(tacklesPerGame * 0.6 + cleanSheetRate * 0.4, 20, 95);

  // 4. ATTACK: вклад в атаку (голы + ассисты) / игра
  // КПЛ норматив: 0.4 (гол+ассист)/игра = 100%
  const contributions = (goals + assists) / appearances;
  const attack = clamp(normalize(contributions, 0.4), 20, 95);

  // 5. DUELS: единоборства за игру
  // КПЛ норматив: 14 единоборств/игра = 100% (Жаксылыков = 13.8)
  const duelsPerGame = normalize(duels / appearances, 14);
  const duelsScore = clamp(duelsPerGame, 20, 95);

  return [
    { key: 'shooting', subject: 'Shooting', value: Math.round(shooting), fullMark: 100, description: 'Shot accuracy & goals' },
    { key: 'passing', subject: 'Passing', value: Math.round(passing), fullMark: 100, description: 'Passes & assists' },
    { key: 'defense', subject: 'Defense', value: Math.round(defense), fullMark: 100, description: 'Tackles & clean sheets' },
    { key: 'attack', subject: 'Attack', value: Math.round(attack), fullMark: 100, description: 'Goals & assists' },
    { key: 'duels', subject: 'Duels', value: Math.round(duelsScore), fullMark: 100, description: 'Duels per game' },
  ];
};

/**
 * Calculate average match rating based on player statistics
 * Rating scale: 4.5 - 10.0 (similar to football match ratings)
 */
export const calculateMatchRating = (
  stats: PlayerStats,
  positionKey: PositionKey
): number => {
  const { appearances, goals, assists, yellowCards, redCards, cleanSheets } = stats;

  // Handle edge case: no appearances
  if (!appearances || appearances === 0) {
    return 6.0;
  }

  // Base rating calculation
  let rating =
    6.0 +
    ((goals || 0) / appearances) * 1.5 +
    ((assists || 0) / appearances) * 1.0 +
    ((cleanSheets || 0) / appearances) * 0.5 -
    ((yellowCards || 0) / appearances) * 0.3 -
    ((redCards || 0) / appearances) * 1.0;

  // Position-specific adjustments
  switch (positionKey) {
    case 'goalkeeper':
      // Clean sheets are more important for goalkeepers
      rating += ((cleanSheets || 0) / appearances) * 2.0;
      break;
    case 'defender':
      // Clean sheets are important for defenders
      rating += ((cleanSheets || 0) / appearances) * 1.5;
      break;
    case 'midfielder':
      // Assists are more important for midfielders
      rating += ((assists || 0) / appearances) * 1.5;
      break;
    case 'forward':
      // Goals are most important for forwards
      rating += ((goals || 0) / appearances) * 2.0;
      break;
  }

  // Clamp to realistic match rating range and round to 1 decimal
  return Math.round(clamp(rating, 4.5, 10.0) * 10) / 10;
};

/**
 * Calculate derived statistics (per-game metrics)
 */
export const calculateDerivedStats = (stats: PlayerStats): DerivedStats => {
  const { appearances, goals, assists, minutesPlayed, cleanSheets, yellowCards, redCards } =
    stats;

  // Handle edge case: no appearances
  if (!appearances || appearances === 0) {
    return {
      goalsPerGame: 0,
      assistsPerGame: 0,
      minutesPerGame: 0,
      cleanSheetRate: 0,
      disciplineScore: 0,
    };
  }

  return {
    goalsPerGame: Math.round(((goals || 0) / appearances) * 100) / 100,
    assistsPerGame: Math.round(((assists || 0) / appearances) * 100) / 100,
    minutesPerGame: Math.min(90, Math.round((minutesPlayed || 0) / appearances)),
    cleanSheetRate: Math.round(((cleanSheets || 0) / appearances) * 100),
    disciplineScore: (yellowCards || 0) + (redCards || 0) * 3,
  };
};

/**
 * Determine player's current form based on performance
 */
export const getPlayerForm = (stats: PlayerStats): PlayerFormData => {
  const { appearances, goals, assists } = stats;

  // Handle edge case: no appearances
  if (!appearances || appearances === 0) {
    return {
      form: 'average',
      formScore: 0,
      trend: 'stable',
    };
  }

  // Calculate form score (weighted: goals count more than assists)
  const formScore = ((goals || 0) * 2 + (assists || 0)) / appearances;

  let form: PlayerForm;
  let trend: 'up' | 'down' | 'stable';

  if (formScore > 1.5) {
    form = 'hot';
    trend = 'up';
  } else if (formScore > 0.8) {
    form = 'good';
    trend = 'stable';
  } else if (formScore > 0.3) {
    form = 'average';
    trend = 'stable';
  } else {
    form = 'cold';
    trend = 'down';
  }

  return {
    form,
    formScore: Math.round(formScore * 100) / 100,
    trend,
  };
};

/**
 * Helper function to get position key from position string
 */
export const getPositionKey = (position: string): PositionKey => {
  const positionLower = position.toLowerCase();

  if (positionLower.includes('вратар') || positionLower.includes('goalkeeper') || positionLower.includes('gk')) {
    return 'goalkeeper';
  }
  if (positionLower.includes('защит') || positionLower.includes('defender') || positionLower.includes('def')) {
    return 'defender';
  }
  if (positionLower.includes('полузащит') || positionLower.includes('midfielder') || positionLower.includes('mid')) {
    return 'midfielder';
  }
  if (positionLower.includes('нападающ') || positionLower.includes('forward') || positionLower.includes('striker') || positionLower.includes('fwd')) {
    return 'forward';
  }

  // Default to midfielder if unknown
  return 'midfielder';
};
