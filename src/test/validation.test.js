import { describe, it, expect } from 'vitest';
import { sanitizeString, validateCredentialInput, validateWalletAddress } from '../utils/validation';

// ─── Wallet Address Validation ─────────────────────────────────
describe('validateWalletAddress', () => {
  it('returns true for valid Stellar public key', () => {
    // Standard Stellar testnet address (56 characters, starts with G)
    expect(validateWalletAddress('GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(validateWalletAddress('')).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(validateWalletAddress(null)).toBe(false);
    expect(validateWalletAddress(undefined)).toBe(false);
  });

  it('returns false for random string', () => {
    expect(validateWalletAddress('not-a-wallet-address')).toBe(false);
  });

  it('returns false for non-string input', () => {
    expect(validateWalletAddress(12345)).toBe(false);
    expect(validateWalletAddress({})).toBe(false);
  });
});

// ─── String Sanitization ───────────────────────────────────────
describe('sanitizeString', () => {
  it('strips HTML tags', () => {
    expect(sanitizeString('<b>bold</b>')).toBe('bold');
    expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
  });

  it('trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('returns empty string for null/undefined', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
    expect(sanitizeString('')).toBe('');
  });

  it('returns empty for non-string input', () => {
    expect(sanitizeString(42)).toBe('');
  });

  it('handles nested HTML tags', () => {
    expect(sanitizeString('<div><p>text</p></div>')).toBe('text');
  });
});

// ─── Credential Input Validation ───────────────────────────────
describe('validateCredentialInput', () => {
  it('returns valid for clean data', () => {
    const result = validateCredentialInput({
      name: 'Alice',
      skill: 'Plumbing',
      city: 'Mumbai',
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('rejects fields over 500 characters', () => {
    const result = validateCredentialInput({
      name: 'A'.repeat(501),
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('detects script injection', () => {
    const result = validateCredentialInput({
      name: '<script>alert("xss")</script>',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toContain('script');
  });

  it('detects javascript: protocol injection', () => {
    const result = validateCredentialInput({
      bio: 'javascript:void(0)',
    });
    expect(result.isValid).toBe(false);
  });

  it('detects on-event handler injection', () => {
    const result = validateCredentialInput({
      name: 'onclick =alert(1)',
    });
    expect(result.isValid).toBe(false);
  });

  it('allows numeric values without validation', () => {
    const result = validateCredentialInput({
      name: 'Alice',
      exp: 5,
    });
    expect(result.isValid).toBe(true);
  });
});
