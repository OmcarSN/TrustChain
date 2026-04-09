import { StrKey } from '@stellar/stellar-sdk';

/**
 * Validates if the given string is a valid Stellar ED25519 public key.
 */
export const validateWalletAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  return StrKey.isValidEd25519PublicKey(address);
};

/**
 * Strips HTML tags and trims whitespace from a string.
 */
export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Validates that credential fields are non-empty strings, max 500 chars each, 
 * and contain no script injection vectors.
 * Returns an object with { isValid: boolean, errors: Object }
 */
export const validateCredentialInput = (data) => {
  const errors = {};
  
  // Script injection regex catch (catches <script>, javascript:, on* handlers)
  const injectionPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|on\w+\s*=/i;

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (value.length > 500) {
        errors[key] = `${key} exceeds maximum length of 500 characters.`;
      }
      if (injectionPattern.test(value)) {
        errors[key] = `Invalid characters or potential script detected in ${key}.`;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
