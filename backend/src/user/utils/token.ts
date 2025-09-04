import { randomBytes } from 'crypto';

/**
 * Generates a secure random token (e.g. for email verification).
 * @returns A 64-character hex string token.
 */
export const generateToken = (): string => {
  return randomBytes(32).toString('hex');
};
