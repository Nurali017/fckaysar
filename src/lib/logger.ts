/**
 * Logger - Production-safe logging utility
 * Only outputs logs in development mode
 */

const isDev = import.meta.env.DEV;

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

const createLogger = (): Logger => {
  const logWithLevel = (level: LogLevel) => (...args: unknown[]) => {
    if (isDev) {
      console[level](...args);
    }
  };

  return {
    log: logWithLevel('log'),
    error: logWithLevel('error'),
    warn: logWithLevel('warn'),
    info: logWithLevel('info'),
    debug: logWithLevel('debug'),
  };
};

export const logger = createLogger();

// Named exports for convenience
export const { log, error, warn, info, debug } = logger;
