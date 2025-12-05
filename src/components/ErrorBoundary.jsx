import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Filter out extension-related errors
    const extensionErrors = [
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      'Failed to fetch dynamically imported module',
      'message channel closed'
    ];

    const isExtensionError = extensionErrors.some(keyword =>
      error.message?.toLowerCase().includes(keyword.toLowerCase()) ||
      error.stack?.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isExtensionError) {
      // Silently ignore extension errors
      console.warn('Browser extension error (ignored):', error.message);
      this.setState({ hasError: false, error: null });
      return;
    }

    // Log real application errors
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Check if it's an extension error before showing error UI
      const extensionErrors = [
        'chrome-extension://',
        'Failed to fetch dynamically imported module',
        'message channel closed'
      ];

      const isExtensionError = extensionErrors.some(keyword =>
        this.state.error.message?.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isExtensionError) {
        // Don't show error UI for extension errors
        return this.props.children;
      }

      // Show error UI for real errors
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="card p-8 max-w-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
