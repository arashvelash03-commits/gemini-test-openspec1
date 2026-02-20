import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { Buffer } from "buffer";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // AES block size for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a text using AES-256-GCM.
 * Format: enc:v1:<iv_hex>:<auth_tag_hex>:<ciphertext_hex>
 */
export function encrypt(text: string): string {
  if (!text) return text;

  const keyEnv = process.env.ENCRYPTION_KEY;

  if (!keyEnv) {
    throw new Error("ENCRYPTION_KEY environment variable is not set.");
  }

  let key: Buffer;
  try {
    key = Buffer.from(keyEnv, 'hex');
    if (key.length !== 32) {
      throw new Error("Key length must be 32 bytes (64 hex characters)");
    }
  } catch (e: any) {
    throw new Error(`Invalid ENCRYPTION_KEY: ${e.message}`);
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `enc:v1:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a text using AES-256-GCM.
 * Handles legacy plaintext secrets by checking for "enc:v1:" prefix.
 */
export function decrypt(text: string): string {
  if (!text) return text;

  // Check if encrypted with our scheme
  if (!text.startsWith("enc:v1:")) {
    // Assume legacy plaintext
    return text;
  }

  const parts = text.split(":");
  if (parts.length !== 5) {
    console.warn("Malformed encrypted string encountered:", text);
    return text;
  }

  const [, , ivHex, authTagHex, encryptedHex] = parts;

  const keyEnv = process.env.ENCRYPTION_KEY;

  if (!keyEnv) {
    throw new Error("ENCRYPTION_KEY environment variable is not set.");
  }

  let key: Buffer;
  try {
    key = Buffer.from(keyEnv, 'hex');
    if (key.length !== 32) {
       throw new Error("Key length must be 32 bytes");
    }
  } catch (e: any) {
    throw new Error(`Invalid ENCRYPTION_KEY: ${e.message}`);
  }

  try {
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt secret");
  }
}
