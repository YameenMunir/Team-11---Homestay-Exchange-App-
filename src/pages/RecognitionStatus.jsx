import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, TrendingUp, Calendar, Star, ArrowLeft } from 'lucide-react';
import { getRecognitionDetails, getRatingHistory, getTierBadgeInfo } from '../services/recognitionService';
import { useUser } from '../context/UserContext';
import RecognitionBadge from '../components/RecognitionBadge';

export default function RecognitionStatus() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [recognitionData, setRecognitionData] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [milestones, setMilestones] = useState({});

  useEffect(() => {
    const loadRecognitionData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        // Get recognition details
        const detailsResult = await getRecognitionDetails(user.id);
        if (detailsResult.success) {
          setRecognitionData(detailsResult.data);
        }

        // Get rating history
        const historyResult = await getRatingHistory(user.id);
        if (historyResult.success) {
          setRatingHistory(historyResult.data.history);
          setMilestones(historyResult.data.milestones);
        }
      } catch (error) {
        console.error('Error loading recognition data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecognitionData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your recognition status...</p>
        </div>
      </div>
    );
  }

  const allTiers = [
    { tier: 'bronze', requirement: 2 },
    { tier: 'silver', requirement: 4 },
    { tier: 'gold', requirement: 6 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-600" />
            Recognition Status
          </h1>
          <p className="mt-2 text-gray-600">
            Track your performance and recognition tier progression
          </p>
        </div>

        {/* Current Status */}
        <div className="mb-8">
          <RecognitionBadge recognitionData={recognitionData} size="large" showProgress={true} />
        </div>

        {/* How it Works */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            How Recognition Tiers Work
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Recognition tiers are earned by consistently receiving <strong>4-5 star ratings</strong> from your hosts over consecutive months.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {allTiers.map(({ tier, requirement }) => {
                const badgeInfo = getTierBadgeInfo(tier);
                const isAchieved = recognitionData?.current_tier === tier ||
                  (tier === 'bronze' && ['silver', 'gold'].includes(recognitionData?.current_tier)) ||
                  (tier === 'silver' && recognitionData?.current_tier === 'gold');

                return (
                  <div
                    key={tier}
                    className={`p-4 rounded-lg border-2 ${
                      isAchieved
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badgeInfo.icon}</div>
                    <h3 className="font-bold text-gray-900">{badgeInfo.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{badgeInfo.description}</p>
                    <p className="text-xs text-gray-500">
                      Requires: {requirement} consecutive months
                    </p>
                    {isAchieved && milestones[`${tier}_achieved_at`] && (
                      <p className="text-xs text-purple-600 font-medium mt-2">
                        ✓ Achieved {new Date(milestones[`${tier}_achieved_at`]).toLocaleDateString('en-GB', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rating History */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Monthly Rating History
          </h2>

          {ratingHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No ratings yet. Start receiving feedback to build your recognition status!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ratingHistory.map((record) => (
                <div
                  key={record.month}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    record.isHighRating
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(record.month + '-01').toLocaleDateString('en-GB', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        Average Rating: <strong>{record.averageRating}</strong> / 5
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.isHighRating ? (
                      <>
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">High Rating</span>
                        </div>
                        <div className="flex">
                          {[...Array(Math.round(record.averageRating))].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex">
                        {[...Array(Math.round(record.averageRating))].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-gray-400 text-gray-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {ratingHistory.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Maintain 4-5 star ratings consistently to advance through the tiers.
                Each tier unlocks as you accumulate consecutive high-rating months!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
