import { encrypt, decrypt } from "../src/lib/encryption";
import { randomBytes } from "crypto";

// Use a dummy key for testing if not set
if (!process.env.ENCRYPTION_KEY) {
    console.log("⚠️ ENCRYPTION_KEY not set, using dummy key for testing.");
    process.env.ENCRYPTION_KEY = "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff";
}

async function runTest() {
    console.log("🔒 Starting Encryption Flow Test...");

    // Test 1: Encrypt/Decrypt Round Trip
    const originalSecret = randomBytes(20).toString('hex');
    console.log(`\n1. Testing Round Trip with secret: ${originalSecret}`);

    try {
        const encrypted = encrypt(originalSecret);
        console.log(`   Encrypted: ${encrypted}`);

        if (!encrypted.startsWith("enc:v1:")) {
            throw new Error("Encrypted string does not start with expected prefix");
        }

        const decrypted = decrypt(encrypted);
        console.log(`   Decrypted: ${decrypted}`);

        if (decrypted !== originalSecret) {
            throw new Error("❌ Decrypted secret does NOT match original!");
        }
        console.log("   ✅ Round Trip Success");
    } catch (e) {
        console.error("   ❌ Round Trip Failed:", e);
        process.exit(1);
    }

    // Test 2: Legacy Secret Support
    const legacySecret = "JBSWY3DPEHPK3PXP"; // Typical base32 secret
    console.log(`\n2. Testing Legacy Secret Support: ${legacySecret}`);

    try {
        const decryptedLegacy = decrypt(legacySecret);
        console.log(`   Decrypted Legacy: ${decryptedLegacy}`);

        if (decryptedLegacy !== legacySecret) {
            throw new Error("❌ Legacy secret was modified during decryption!");
        }
        console.log("   ✅ Legacy Support Success");
    } catch (e) {
        console.error("   ❌ Legacy Support Failed:", e);
        process.exit(1);
    }

    // Test 3: Malformed Encrypted String (Should return as is or handle safely)
    const malformed = "enc:v1:bad:data";
    console.log(`\n3. Testing Malformed String: ${malformed}`);
    try {
        const result = decrypt(malformed);
        console.log(`   Result: ${result}`);
        // Based on implementation, it logs a warning and returns original text
        if (result !== malformed) {
             throw new Error("❌ Unexpected behavior for malformed string");
        }
        console.log("   ✅ Malformed Handling Success (returned original)");
    } catch (e) {
        console.error("   ❌ Malformed Handling Failed:", e);
    }

    console.log("\n🎉 All tests passed!");
}

runTest();
