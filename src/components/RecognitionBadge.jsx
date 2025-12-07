import { Award, TrendingUp, Star } from 'lucide-react';
import { getTierBadgeInfo, calculateTierProgress } from '../services/recognitionService';

/**
 * RecognitionBadge Component
 * Displays a student's current recognition tier badge with progress
 */
export default function RecognitionBadge({ recognitionData, showProgress = true, size = 'medium' }) {
  if (!recognitionData) return null;

  const { current_tier, consecutive_high_ratings } = recognitionData;
  const badgeInfo = getTierBadgeInfo(current_tier);
  const progress = calculateTierProgress(consecutive_high_ratings || 0, current_tier);

  // Size classes
  const sizeClasses = {
    small: {
      container: 'p-3',
      icon: 'w-8 h-8 text-2xl',
      title: 'text-sm',
      badge: 'text-xs',
      progress: 'h-1.5',
    },
    medium: {
      container: 'p-4',
      icon: 'w-12 h-12 text-4xl',
      title: 'text-base',
      badge: 'text-sm',
      progress: 'h-2',
    },
    large: {
      container: 'p-6',
      icon: 'w-16 h-16 text-5xl',
      title: 'text-lg',
      badge: 'text-base',
      progress: 'h-3',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg ${classes.container} border-2 border-purple-200`}>
      <div className="flex items-center gap-4">
        {/* Badge Icon */}
        <div
          className={`${classes.icon} flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-md`}
          style={{ color: badgeInfo.color }}
        >
          <span className="font-bold">{badgeInfo.icon}</span>
        </div>

        {/* Badge Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-gray-900 ${classes.title}`}>
              {badgeInfo.name} Status
            </h3>
            {current_tier !== 'none' && (
              <Award className="w-4 h-4 text-purple-600" />
            )}
          </div>
          <p className={`text-gray-600 ${classes.badge}`}>
            {badgeInfo.description}
          </p>
          {consecutive_high_ratings > 0 && (
            <p className={`text-purple-600 font-medium mt-1 ${classes.badge}`}>
              {consecutive_high_ratings} consecutive month{consecutive_high_ratings !== 1 ? 's' : ''} of excellence
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && progress.nextTier && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Progress to {getTierBadgeInfo(progress.nextTier).name}
            </span>
            <span className="text-xs font-medium text-purple-600">
              {progress.progress}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`bg-gradient-to-r from-purple-600 to-blue-600 ${classes.progress} transition-all duration-500`}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress.message}
          </p>
        </div>
      )}

      {/* Achievement Date */}
      {current_tier !== 'none' && recognitionData[`${current_tier}_achieved_at`] && (
        <div className="mt-3 pt-3 border-t border-purple-200">
          <p className="text-xs text-gray-500">
            Achieved on {new Date(recognitionData[`${current_tier}_achieved_at`]).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact Badge Display (for listings/cards)
 */
export function CompactRecognitionBadge({ tier }) {
  const badgeInfo = getTierBadgeInfo(tier);

  if (tier === 'none') return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border-2"
      style={{
        borderColor: badgeInfo.color,
        backgroundColor: `${badgeInfo.color}20`,
        color: badgeInfo.color,
      }}
    >
      <span>{badgeInfo.icon}</span>
      <span>{badgeInfo.name}</span>
    </div>
  );
}

/**
 * Badge Icon Only (minimal display)
 */
export function BadgeIcon({ tier, className = 'w-6 h-6' }) {
  const badgeInfo = getTierBadgeInfo(tier);

  if (tier === 'none') {
    return <Star className={`${className} text-gray-300`} />;
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-full font-bold`}
      style={{ color: badgeInfo.color }}
      title={`${badgeInfo.name} Badge`}
    >
      <span className="text-sm">{badgeInfo.icon}</span>
    </div>
  );
}
