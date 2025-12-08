/**
 * CMS Client - Axios instance for Payload CMS API
 */

import axios, { type AxiosError } from 'axios';
import i18n from '@/i18n/config';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

// In development, use proxy path. In production, use full CMS URL
const isDev = import.meta.env.DEV;
const CMS_BASE_URL = isDev ? '/cms-api' : `${env.VITE_CMS_BASE_URL || 'http://localhost:3000'}/api`;

/**
 * Create axios instance for CMS
 */
export const cmsApiClient = axios.create({
  baseURL: CMS_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Map app language to CMS locale
 */
const mapLocale = (appLang: string): string => {
  const localeMap: Record<string, string> = {
    kk: 'kk',
    ru: 'ru',
    en: 'en',
  };
  return localeMap[appLang] || 'ru';
};

/**
 * Request interceptor: Add locale parameter
 */
cmsApiClient.interceptors.request.use(
  (config) => {
    const currentLang = i18n.language || 'kk';
    const locale = mapLocale(currentLang);

    // Add locale as query parameter
    config.params = {
      ...config.params,
      locale,
    };

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle errors
 */
cmsApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      logger.error('CMS API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      logger.warn('CMS API: No response received (CMS may be offline)');
    } else {
      logger.error('CMS Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Check if CMS is available
 */
export const checkCMSHealth = async (): Promise<boolean> => {
  try {
    const response = await cmsApiClient.get('/users', {
      timeout: 5000,
      params: { limit: 1 }
    });
    return response.status === 200;
  } catch {
    return false;
  }
};

// Alias for backwards compatibility with hooks that imported from api/client/cms-client
export const cmsClient = cmsApiClient;

export default cmsApiClient;
