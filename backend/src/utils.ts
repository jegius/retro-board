import { randomBytes, scryptSync } from 'crypto';

export function generateRandomHashedPassword() {
  const randomPassword = randomBytes(16).toString('hex');
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(randomPassword, salt, 64).toString('hex').slice(0, 8);
  return {
    salt,
    hashedPassword
  };
}