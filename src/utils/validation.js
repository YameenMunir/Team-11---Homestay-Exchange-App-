import * as yup from "yup";

const todoValidationSchema = yup.object({
  todo: yup
    .string("Enter your todo")
    .min(4, "Mininum 4 characters")
    .required("Todo is required"),
});

/**
 * RFC 5322 compliant email validation
 * This regex validates emails according to the standard format:
 * - Local part: allows letters, numbers, and special characters (._%+-)
 * - @ symbol required
 * - Domain part: allows letters, numbers, and hyphens
 * - TLD: requires at least 2 characters
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Email validation error types
 */
export const EMAIL_ERRORS = {
  REQUIRED: 'Email address is required',
  MISSING_AT: 'Email must contain an @ symbol',
  MISSING_DOMAIN: 'Email must have a domain after the @ symbol',
  MISSING_TLD: 'Email must have a valid domain extension (e.g., .com, .co.uk)',
  INVALID_LOCAL: 'The part before @ contains invalid characters',
  INVALID_DOMAIN: 'The domain contains invalid characters',
  INVALID_FORMAT: 'Please enter a valid email address',
  CONSECUTIVE_DOTS: 'Email cannot contain consecutive dots',
  STARTS_WITH_DOT: 'Email cannot start with a dot',
  ENDS_WITH_DOT: 'Email cannot end with a dot before @',
};

/**
 * Validates an email address and returns specific error messages
 * @param {string} email - The email address to validate
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateEmail = (email) => {
  // Check if email is provided
  if (!email || email.trim() === '') {
    return { isValid: false, error: EMAIL_ERRORS.REQUIRED };
  }

  const trimmedEmail = email.trim();

  // Check for @ symbol
  if (!trimmedEmail.includes('@')) {
    return { isValid: false, error: EMAIL_ERRORS.MISSING_AT };
  }

  const [localPart, domainPart] = trimmedEmail.split('@');

  // Check for empty local part (before @)
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: EMAIL_ERRORS.INVALID_LOCAL };
  }

  // Check for empty domain part (after @)
  if (!domainPart || domainPart.length === 0) {
    return { isValid: false, error: EMAIL_ERRORS.MISSING_DOMAIN };
  }

  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return { isValid: false, error: EMAIL_ERRORS.CONSECUTIVE_DOTS };
  }

  // Check if local part starts with dot
  if (localPart.startsWith('.')) {
    return { isValid: false, error: EMAIL_ERRORS.STARTS_WITH_DOT };
  }

  // Check if local part ends with dot
  if (localPart.endsWith('.')) {
    return { isValid: false, error: EMAIL_ERRORS.ENDS_WITH_DOT };
  }

  // Check for TLD (domain extension)
  if (!domainPart.includes('.')) {
    return { isValid: false, error: EMAIL_ERRORS.MISSING_TLD };
  }

  // Split domain to check TLD
  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];

  // TLD must be at least 2 characters
  if (tld.length < 2) {
    return { isValid: false, error: EMAIL_ERRORS.MISSING_TLD };
  }

  // Final regex validation for complete format check
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { isValid: false, error: EMAIL_ERRORS.INVALID_FORMAT };
  }

  return { isValid: true, error: null };
};

/**
 * Simple boolean check for email validity
 * @param {string} email - The email address to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return validateEmail(email).isValid;
};

/**
 * Custom Yup email validation method
 * Usage: yup.string().emailStrict('Custom error message')
 */
yup.addMethod(yup.string, 'emailStrict', function (message) {
  return this.test('email-strict', message || EMAIL_ERRORS.INVALID_FORMAT, function (value) {
    const { path, createError } = this;

    if (!value) return true; // Let .required() handle empty values

    const result = validateEmail(value);

    if (!result.isValid) {
      return createError({ path, message: result.error });
    }

    return true;
  });
});

export { todoValidationSchema };
