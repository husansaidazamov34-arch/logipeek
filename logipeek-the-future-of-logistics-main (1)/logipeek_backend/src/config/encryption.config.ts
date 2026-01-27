import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly saltLength = 64;
  private readonly tagLength = 16;
  private readonly tagPosition: number;
  private readonly encryptedPosition: number;

  private key: Buffer;

  constructor(secret: string) {
    // Generate encryption key from secret
    const salt = Buffer.from(secret.slice(0, this.saltLength));
    this.key = scryptSync(secret, salt, this.keyLength);
    
    this.tagPosition = this.saltLength + this.ivLength;
    this.encryptedPosition = this.tagPosition + this.tagLength;
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(text: string): string {
    if (!text) return text;

    const iv = randomBytes(this.ivLength);
    const salt = randomBytes(this.saltLength);
    
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    
    const tag = cipher.getAuthTag();
    
    // Combine: salt + iv + tag + encrypted
    const result = Buffer.concat([salt, iv, tag, encrypted]);
    
    return result.toString('base64');
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;

    try {
      const buffer = Buffer.from(encryptedText, 'base64');
      
      const salt = buffer.subarray(0, this.saltLength);
      const iv = buffer.subarray(this.saltLength, this.tagPosition);
      const tag = buffer.subarray(this.tagPosition, this.encryptedPosition);
      const encrypted = buffer.subarray(this.encryptedPosition);
      
      const decipher = createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(tag);
      
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}

// Singleton instance
let encryptionService: EncryptionService;

export function getEncryptionService(secret?: string): EncryptionService {
  if (!encryptionService) {
    if (!secret) {
      throw new Error('Encryption secret is required');
    }
    encryptionService = new EncryptionService(secret);
  }
  return encryptionService;
}
