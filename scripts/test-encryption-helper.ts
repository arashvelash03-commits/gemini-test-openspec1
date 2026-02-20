import { encrypt, decrypt } from "../src/lib/encryption";
import assert from "assert";

console.log("Testing encryption...");

// Set dummy secret for testing if not set
if (!process.env.AUTH_SECRET) {
    process.env.AUTH_SECRET = "test-secret";
}

try {
  const secret = "JBSWY3DPEHPK3PXP";
  const encrypted = encrypt(secret);
  console.log("Encrypted:", encrypted);

  if (encrypted === secret) {
      throw new Error("Encryption failed: returned plaintext");
  }

  const decrypted = decrypt(encrypted);
  console.log("Decrypted:", decrypted);

  assert.strictEqual(decrypted, secret, "Decrypted text should match original");

  // Test legacy plaintext handling
  const legacy = "LEGACY_SECRET";
  const legacyDecrypted = decrypt(legacy);
  console.log("Legacy decrypted (should be same):", legacyDecrypted);
  assert.strictEqual(legacyDecrypted, legacy, "Legacy plaintext should be returned as is");

  // Test null
  assert.strictEqual(decrypt(null), null);
  assert.strictEqual(encrypt(""), "");

  console.log("✅ Encryption/Decryption test passed!");
} catch (e) {
  console.error("❌ Test failed:", e);
  process.exit(1);
}
