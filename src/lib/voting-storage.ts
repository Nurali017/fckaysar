/**
 * Voting Storage - localStorage utilities for FanZone voting
 * Manages one vote per browser for polls and player voting
 */

const STORAGE_PREFIX = 'fanzone_';
const PLAYER_VOTE_PREFIX = `${STORAGE_PREFIX}player_vote_`;
const POLL_VOTE_PREFIX = `${STORAGE_PREFIX}poll_vote_`;

/**
 * Check if user has already voted for a player in a specific match
 */
export const hasVotedForPlayer = (matchId: string): boolean => {
  try {
    const key = `${PLAYER_VOTE_PREFIX}${matchId}`;
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
};

/**
 * Get the player ID that user voted for in a specific match
 */
export const getPlayerVote = (matchId: string): string | null => {
  try {
    const key = `${PLAYER_VOTE_PREFIX}${matchId}`;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * Save player vote to localStorage
 */
export const savePlayerVote = (matchId: string, playerId: string): void => {
  try {
    const key = `${PLAYER_VOTE_PREFIX}${matchId}`;
    localStorage.setItem(key, playerId);
  } catch {
    // localStorage may be unavailable in private browsing mode
  }
};

/**
 * Check if user has already voted in a specific poll
 */
export const hasVotedInPoll = (pollId: string): boolean => {
  try {
    const key = `${POLL_VOTE_PREFIX}${pollId}`;
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
};

/**
 * Get the option index that user voted for in a specific poll
 */
export const getPollVote = (pollId: string): number | null => {
  try {
    const key = `${POLL_VOTE_PREFIX}${pollId}`;
    const value = localStorage.getItem(key);
    return value !== null ? parseInt(value, 10) : null;
  } catch {
    return null;
  }
};

/**
 * Save poll vote to localStorage
 */
export const savePollVote = (pollId: string, optionIndex: number): void => {
  try {
    const key = `${POLL_VOTE_PREFIX}${pollId}`;
    localStorage.setItem(key, optionIndex.toString());
  } catch {
    // localStorage may be unavailable in private browsing mode
  }
};

/**
 * Clear all voting data (for testing/debugging)
 */
export const clearAllVotes = (): void => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // localStorage may be unavailable in private browsing mode
  }
};
