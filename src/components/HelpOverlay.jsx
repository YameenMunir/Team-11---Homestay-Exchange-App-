import { useUser } from '../context/UserContext';
import { Info } from 'lucide-react';

/**
 * HelpOverlay component that shows contextual help when enabled
 * Displays helpful tooltips and explanations throughout the app
 * Does not affect layout when disabled
 * Tooltip appears at top-right of the help icon when hovering over the icon
 */
const HelpOverlay = ({ children, helpText, position = 'top-right' }) => {
  const { accessibilitySettings } = useUser();

  // If help overlay is disabled, return children without any wrapper
  if (!accessibilitySettings.helpOverlay || !helpText) {
    return <>{children}</>;
  }

  // Tooltip position classes - relative to the help icon button
  const tooltipPositionClasses = {
    'top-right': 'bottom-full right-0 mb-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    'bottom': 'top-full left-1/2 -translate-x-1/2 mt-2',
    'left': 'right-full top-1/2 -translate-y-1/2 mr-2',
    'right': 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Arrow position classes for the tooltip pointer
  const arrowPositionClasses = {
    'top-right': 'right-2 -bottom-1',
    'top-left': 'left-2 -bottom-1',
    'top': 'left-1/2 -translate-x-1/2 -bottom-1',
    'bottom': 'left-1/2 -translate-x-1/2 -top-1',
    'left': 'top-1/2 -translate-y-1/2 -right-1',
    'right': 'top-1/2 -translate-y-1/2 -left-1',
  };

  return (
    <div style={{ display: 'contents' }}>
      <div className="relative">
        {children}

        {/* Help Icon Container - positioned absolutely so it doesn't affect layout */}
        <div className="absolute top-3 right-3 z-10 pointer-events-auto group/help">
          {/* Help Icon Button */}
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-help shadow-md hover:bg-blue-600 transition-colors">
            <Info className="w-4 h-4 text-white" />
          </div>

          {/* Tooltip - positioned relative to the help icon, appears on icon hover */}
          <div
            className={`absolute ${tooltipPositionClasses[position] || tooltipPositionClasses['top-right']} z-50
                        invisible group-hover/help:visible
                        bg-gray-900 text-white text-sm rounded-lg px-3 py-2
                        shadow-xl pointer-events-none opacity-0 group-hover/help:opacity-100
                        transition-opacity duration-200`}
            style={{ whiteSpace: 'normal', width: 'max-content', maxWidth: 'min(300px, 80vw)' }}
          >
            {helpText}
            {/* Tooltip arrow */}
            <div
              className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${arrowPositionClasses[position] || arrowPositionClasses['top-right']}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay;
