import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContextNew';
import {
  submitMonthlyFeedback,
  getFeedbackByFacilitation,
  getFeedbackReceived,
  getFeedbackSubmitted,
  canSubmitFeedback,
  checkMultipleFeedbackEligibility,
  getFeedbackStats,
  getCurrentMonth,
  updateMonthlyFeedback,
} from '../services/feedbackService';
import {
  getRecognitionStatus,
  getRecognitionDetails,
  getTierBadgeInfo,
  calculateTierProgress,
} from '../services/recognitionService';

/**
 * Hook for managing monthly feedback functionality
 * Provides methods for submitting, viewing, and tracking feedback
 */
export const useMonthlyFeedback = (facilitationId = null) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());

  // Check if user can submit feedback for the facilitation
  const checkEligibility = useCallback(async () => {
    if (!facilitationId || !user) {
      setCanSubmit(false);
      return;
    }

    try {
      const result = await canSubmitFeedback(facilitationId);
      if (result.success) {
        setCanSubmit(result.canSubmit);
        setCurrentMonth(result.month);
      }
    } catch (err) {
      console.error('Error checking feedback eligibility:', err);
      setCanSubmit(false);
    }
  }, [facilitationId, user]);

  // Fetch feedback for the facilitation
  const fetchFeedback = useCallback(async (month = null) => {
    if (!facilitationId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getFeedbackByFacilitation(facilitationId, month);
      if (result.success) {
        setFeedback(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [facilitationId]);

  // Initialize data when facilitation changes
  useEffect(() => {
    if (facilitationId) {
      checkEligibility();
      fetchFeedback();
    }
  }, [facilitationId, checkEligibility, fetchFeedback]);

  // Submit new feedback
  const submit = useCallback(async (feedbackData) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await submitMonthlyFeedback({
        ...feedbackData,
        facilitation_id: facilitationId,
      });

      if (result.success) {
        // Refresh data after submission
        await checkEligibility();
        await fetchFeedback();
      } else {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to submit feedback';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, facilitationId, checkEligibility, fetchFeedback]);

  // Update existing feedback
  const update = useCallback(async (feedbackId, updates) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateMonthlyFeedback(feedbackId, updates);

      if (result.success) {
        await fetchFeedback();
      } else {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update feedback';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchFeedback]);

  return {
    feedback,
    loading,
    error,
    canSubmit,
    currentMonth,
    submit,
    update,
    refresh: fetchFeedback,
    checkEligibility,
  };
};

/**
 * Hook for viewing received feedback (as host or recipient)
 */
export const useFeedbackReceived = (userId = null) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);

  const targetUserId = userId || user?.id;

  const fetchFeedback = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [feedbackResult, statsResult] = await Promise.all([
        getFeedbackReceived(targetUserId),
        getFeedbackStats(targetUserId),
      ]);

      if (feedbackResult.success) {
        setFeedback(feedbackResult.data || []);
      } else {
        setError(feedbackResult.error);
      }

      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedback,
    stats,
    loading,
    error,
    refresh: fetchFeedback,
  };
};

/**
 * Hook for viewing submitted feedback (as submitter)
 */
export const useFeedbackSubmitted = (userId = null) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState([]);

  const targetUserId = userId || user?.id;

  const fetchFeedback = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getFeedbackSubmitted(targetUserId);
      if (result.success) {
        setFeedback(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedback,
    loading,
    error,
    refresh: fetchFeedback,
  };
};

/**
 * Hook for checking feedback eligibility across multiple facilitations
 */
export const useFeedbackEligibility = (facilitationIds = []) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState({});
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());

  const checkEligibility = useCallback(async () => {
    if (!user || facilitationIds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await checkMultipleFeedbackEligibility(facilitationIds);
      if (result.success) {
        setEligibility(result.data || {});
        // Update current month from first result
        const firstId = facilitationIds[0];
        if (result.data?.[firstId]?.month) {
          setCurrentMonth(result.data[firstId].month);
        }
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
    } finally {
      setLoading(false);
    }
  }, [user, facilitationIds]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  return {
    eligibility,
    loading,
    currentMonth,
    refresh: checkEligibility,
    canSubmitFor: (facilitationId) => eligibility[facilitationId]?.canSubmit ?? false,
  };
};

/**
 * Hook for student recognition tier status
 */
export const useRecognitionTier = (studentId = null) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [details, setDetails] = useState(null);

  const targetStudentId = studentId || (profile?.role === 'guest' ? user?.id : null);

  const fetchRecognition = useCallback(async () => {
    if (!targetStudentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [statusResult, detailsResult] = await Promise.all([
        getRecognitionStatus(targetStudentId),
        getRecognitionDetails(targetStudentId),
      ]);

      if (statusResult.success) {
        setStatus(statusResult.data);
      } else {
        setError(statusResult.error);
      }

      if (detailsResult.success) {
        setDetails(detailsResult.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [targetStudentId]);

  useEffect(() => {
    fetchRecognition();
  }, [fetchRecognition]);

  // Get badge info for current tier
  const badgeInfo = status?.tier ? getTierBadgeInfo(status.tier) : getTierBadgeInfo('none');

  // Calculate progress to next tier
  const progress = status
    ? calculateTierProgress(status.consecutive_months, status.tier)
    : { progress: 0, remaining: 2, nextTier: 'bronze', message: '2 more months to bronze' };

  return {
    status,
    details,
    badgeInfo,
    progress,
    loading,
    error,
    refresh: fetchRecognition,
  };
};

export default useMonthlyFeedback;
