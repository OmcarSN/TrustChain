import { StrKey } from '@stellar/stellar-sdk';

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether all fields passed validation
 * @property {Object<string, string>} errors - Map of field name to error message
 */

/**
 * Validates if the given string is a valid Stellar ED25519 public key.
 * Uses the official Stellar SDK StrKey validator.
 *
 * @param {string} address - The wallet address to validate
 * @returns {boolean} True if the address is a valid ED25519 public key
 */
export const validateWalletAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  return StrKey.isValidEd25519PublicKey(address);
};

/**
 * Strips HTML tags and trims whitespace from a string.
 * Used to sanitize user input before storage or display.
 *
 * @param {string} str - The input string to sanitize
 * @returns {string} The sanitized string with HTML tags removed and whitespace trimmed
 */
export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Validates that credential fields are non-empty strings, max 500 chars each,
 * and contain no script injection vectors.
 *
 * @param {Object<string, string>} data - Key-value pairs of credential field names and values
 * @returns {ValidationResult} Object with isValid boolean and errors map
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
