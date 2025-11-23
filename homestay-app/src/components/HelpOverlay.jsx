import { useUser } from '../context/UserContext';
import { Info } from 'lucide-react';

/**
 * HelpOverlay component that shows contextual help when enabled
 * Displays helpful tooltips and explanations throughout the app
 * Does not affect layout when disabled
 */
const HelpOverlay = ({ children, helpText, position = 'top' }) => {
  const { accessibilitySettings } = useUser();

  // If help overlay is disabled, return children without any wrapper
  if (!accessibilitySettings.helpOverlay || !helpText) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group" style={{ display: 'contents' }}>
      <div className="relative">
        {children}

        {/* Help Icon - positioned absolutely so it doesn't affect layout */}
        <div className="absolute top-3 right-3 z-10 pointer-events-auto">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-help shadow-md hover:bg-blue-600 transition-colors">
            <Info className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Tooltip */}
        <div
          className={`absolute ${positionClasses[position]} z-50 invisible group-hover:visible
                      bg-gray-900 text-white text-sm rounded-lg px-3 py-2
                      max-w-xs shadow-xl pointer-events-none opacity-0 group-hover:opacity-100
                      transition-opacity duration-200`}
          style={{ whiteSpace: 'normal', width: 'max-content', maxWidth: '300px' }}
        >
          {helpText}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45
                          left-1/2 -translate-x-1/2 -bottom-1"></div>
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay;
