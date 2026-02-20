import "server-only";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ENCRYPTION_KEY or AUTH_SECRET must be set in production");
    }
    console.warn("No encryption key found, using unsafe default for development");
    return crypto.createHash("sha256").update("unsafe-dev-secret").digest();
  }

  if (process.env.ENCRYPTION_KEY && /^[0-9a-fA-F]{64}$/.test(process.env.ENCRYPTION_KEY)) {
    return Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encrypt(text: string): string {
  if (!text) return text;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(text: string | null | undefined): string | null | undefined {
  if (!text) return text;

  const parts = text.split(":");
  // Check if it matches our format: iv(32 hex):tag(32 hex):ciphertext
  if (parts.length !== 3 || parts[0].length !== 32 || parts[1].length !== 32) {
    // Assume legacy plaintext and return as is
    return text;
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  try {
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    // Throwing error is safer than returning possibly encrypted text or silently failing
    throw new Error("Failed to decrypt secret");
  }
}
