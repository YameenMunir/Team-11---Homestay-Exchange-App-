import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setStatus('error');
          setMessage('Failed to verify email. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (session) {
          // Email confirmed, get user profile to redirect to appropriate dashboard
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setStatus('error');
            setMessage('Account verified but profile not found. Please contact support.');
            setTimeout(() => navigate('/login'), 3000);
            return;
          }

          setStatus('success');
          setMessage('Email verified successfully! Redirecting to your dashboard...');

          // Redirect based on role
          setTimeout(() => {
            if (profileData.role === 'admin') {
              navigate('/admin');
            } else if (profileData.role === 'host') {
              navigate('/host');
            } else {
              navigate('/guest');
            }
          }, 2000);
        } else {
          setStatus('error');
          setMessage('No session found. Please try logging in.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try logging in.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verifying Email
              </h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Email Verified!
              </h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
