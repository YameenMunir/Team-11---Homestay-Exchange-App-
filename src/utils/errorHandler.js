/**
 * Global error handler to suppress browser extension errors
 * These errors don't affect the application functionality
 */

// List of patterns that indicate extension-related errors
const EXTENSION_ERROR_PATTERNS = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'extension:/',
  'Failed to fetch dynamically imported module',
  'message channel closed',
  'Extension context invalidated',
  'Cannot access chrome',
  'efaidnbmnnnibpcajpcglclefindmkaj', // Adobe Acrobat extension ID
];

/**
 * Check if error is from a browser extension
 */
export const isExtensionError = (error) => {
  if (!error) return false;

  const errorMessage = error.message || '';
  const errorStack = error.stack || '';
  const errorString = error.toString() || '';

  return EXTENSION_ERROR_PATTERNS.some(pattern =>
    errorMessage.toLowerCase().includes(pattern.toLowerCase()) ||
    errorStack.toLowerCase().includes(pattern.toLowerCase()) ||
    errorString.toLowerCase().includes(pattern.toLowerCase())
  );
};

/**
 * Initialize global error handlers
 */
export const initializeErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionError(event.reason)) {
      console.warn('Browser extension error (suppressed):', event.reason?.message || event.reason);
      event.preventDefault(); // Prevent error from showing in console
      return;
    }

    // Log real application errors
    console.error('Unhandled Promise Rejection:', event.reason);
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    if (isExtensionError(event.error)) {
      console.warn('Browser extension error (suppressed):', event.error?.message || event.message);
      event.preventDefault(); // Prevent error from showing in console
      return;
    }

    // Log real application errors
    console.error('Uncaught Error:', event.error || event.message);
  });

  // Handle resource loading errors (optional)
  window.addEventListener('error', (event) => {
    if (event.target !== window && isExtensionError({ message: event.target?.src || '' })) {
      console.warn('Extension resource loading error (suppressed)');
      event.preventDefault();
      return;
    }
  }, true);
};

/**
 * Wrapper for console.error that filters extension errors
 */
export const safeConsoleError = (...args) => {
  const hasExtensionError = args.some(arg =>
    isExtensionError(arg) ||
    (typeof arg === 'string' && EXTENSION_ERROR_PATTERNS.some(pattern =>
      arg.toLowerCase().includes(pattern.toLowerCase())
    ))
  );

  if (!hasExtensionError) {
    console.error(...args);
  } else {
    console.warn('Extension error (filtered):', ...args);
  }
};

export default {
  initializeErrorHandlers,
  isExtensionError,
  safeConsoleError,
};
