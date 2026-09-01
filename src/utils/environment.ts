/**
 * Utilities for environment detection
 */
export const isBrowser = typeof window !== 'undefined';
export const isNavigator = typeof navigator !== 'undefined';
export const isDocument = typeof document !== 'undefined';
export const isServer = !isBrowser;
