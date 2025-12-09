/**
 * Environment Variables - Validated and typed env configuration
 * Uses Zod for runtime validation
 */

import { z } from 'zod';

const envSchema = z.object({
  // API Configuration
  VITE_SOTA_API_BASE_URL: z.string().optional().default(''),
  VITE_SOTA_API_EMAIL: z.string().email('Invalid API email').optional(),
  VITE_SOTA_API_PASSWORD_BASE64: z.string().optional(),

  // FC Kaisar Configuration
  VITE_FC_KAISAR_TEAM_ID: z.string().regex(/^\d+$/, 'Team ID must be numeric').default('94'),
  VITE_SOTA_CURRENT_SEASON_ID: z.string().regex(/^\d+$/, 'Season ID must be numeric').default('61'),

  // CMS Configuration
  // Empty string = use Vite proxy (/cms-api), URL = direct connection
  VITE_CMS_BASE_URL: z.string().optional().default(''),

  // Feature Flags
  VITE_USE_MOCK_DATA: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  VITE_ENABLE_LIVE_UPDATES: z
    .string()
    .transform(val => val === 'true')
    .default('true'),

  // Contact Information
  VITE_FC_KAISAR_PHONE: z.string().optional().default('+7 (7242) 26-00-00'),
  VITE_FC_KAISAR_EMAIL: z.string().email().optional().default('info@fckaysar.kz'),
  VITE_FC_KAISAR_ADDRESS: z.string().optional().default(''),
});

// Parse and validate environment variables
const parseEnv = () => {
  const rawEnv = {
    VITE_SOTA_API_BASE_URL: import.meta.env.VITE_SOTA_API_BASE_URL,
    VITE_SOTA_API_EMAIL: import.meta.env.VITE_SOTA_API_EMAIL,
    VITE_SOTA_API_PASSWORD_BASE64: import.meta.env.VITE_SOTA_API_PASSWORD_BASE64,
    VITE_FC_KAISAR_TEAM_ID: import.meta.env.VITE_FC_KAISAR_TEAM_ID,
    VITE_SOTA_CURRENT_SEASON_ID: import.meta.env.VITE_SOTA_CURRENT_SEASON_ID,
    VITE_CMS_BASE_URL: import.meta.env.VITE_CMS_BASE_URL,
    VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA,
    VITE_ENABLE_LIVE_UPDATES: import.meta.env.VITE_ENABLE_LIVE_UPDATES,
    VITE_FC_KAISAR_PHONE: import.meta.env.VITE_FC_KAISAR_PHONE,
    VITE_FC_KAISAR_EMAIL: import.meta.env.VITE_FC_KAISAR_EMAIL,
    VITE_FC_KAISAR_ADDRESS: import.meta.env.VITE_FC_KAISAR_ADDRESS,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    // In development, log validation errors
    if (import.meta.env.DEV) {
      console.warn('Environment validation warnings:', result.error.flatten());
    }
    // Return partial data with defaults
    return envSchema.parse({});
  }

  return result.data;
};

export const env = parseEnv();

// Type-safe environment access
export type Env = z.infer<typeof envSchema>;

// Helper to check if API credentials are configured
export const hasApiCredentials = (): boolean => {
  return Boolean(env.VITE_SOTA_API_EMAIL && env.VITE_SOTA_API_PASSWORD_BASE64);
};

// Helper to get team ID as number
export const getTeamId = (): number => {
  return parseInt(env.VITE_FC_KAISAR_TEAM_ID, 10);
};
