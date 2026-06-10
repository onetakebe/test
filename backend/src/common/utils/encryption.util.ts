import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function resolveKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY ?? '';
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, 'hex');
  }
  // Derive a 32-byte key from whatever was provided so dev environments still work.
  return scryptSync(raw || 'one-take-os-dev-key', 'one-take-os-salt', 32);
}

/**
 * Encrypts a plaintext string with AES-256-GCM.
 * Output format: iv.authTag.ciphertext (hex, dot separated).
 */
export function encrypt(plaintext: string): string {
  const key = resolveKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}.${authTag.toString('hex')}.${encrypted.toString('hex')}`;
}

/**
 * Decrypts a string produced by {@link encrypt}.
 */
export function decrypt(payload: string): string {
  const key = resolveKey();
  const [ivHex, tagHex, dataHex] = payload.split('.');
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error('Invalid encrypted payload format');
  }
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
}
