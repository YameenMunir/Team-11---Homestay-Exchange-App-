import { useEffect, useState, useRef } from 'react';
import { useUser } from '../context/UserContext';

/**
 * Custom hook for voice guidance functionality
 * Uses Web Speech Synthesis API to read text aloud
 */
export const useVoiceGuidance = () => {
  const { accessibilitySettings } = useUser();
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceQueueRef = useRef([]);

  // Load and cache available voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API is not supported in this browser');
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        // Process any queued utterances
        if (utteranceQueueRef.current.length > 0) {
          utteranceQueueRef.current.forEach((text) => speakImmediately(text));
          utteranceQueueRef.current = [];
        }
      }
    };

    // Voices might already be loaded
    loadVoices();

    // Listen for voices to be loaded (Chrome, Edge)
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakImmediately = (text) => {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      // Get available voices and prefer English voices
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      // Error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
    }
  };

  const speak = (text) => {
    if (!accessibilitySettings.voiceGuidance) return;
    if (!text || typeof text !== 'string') return;

    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    // If voices aren't loaded yet, queue the text
    if (!voicesLoaded) {
      utteranceQueueRef.current.push(text);
      return;
    }

    speakImmediately(text);
  };

  const speakOnClick = (text) => {
    return () => speak(text);
  };

  const speakOnFocus = (text) => {
    return () => {
      if (accessibilitySettings.voiceGuidance) {
        speak(text);
      }
    };
  };

  return { speak, speakOnClick, speakOnFocus };
};
