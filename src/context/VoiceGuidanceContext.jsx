import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from './UserContext';

const VoiceGuidanceContext = createContext();

export const useVoiceGuidanceContext = () => {
  const context = useContext(VoiceGuidanceContext);
  if (!context) {
    throw new Error('useVoiceGuidanceContext must be used within a VoiceGuidanceProvider');
  }
  return context;
};

/**
 * VoiceGuidanceProvider - Provides global voice guidance functionality
 * Automatically reads interactive elements on focus/click when enabled
 */
export const VoiceGuidanceProvider = ({ children }) => {
  const { accessibilitySettings } = useUser();
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceQueueRef = useRef([]);
  const lastSpokenRef = useRef('');
  const lastSpokenTimeRef = useRef(0);

  // Load voices on mount
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
        if (utteranceQueueRef.current.length > 0 && accessibilitySettings.voiceGuidance) {
          utteranceQueueRef.current.forEach((text) => speakImmediately(text));
          utteranceQueueRef.current = [];
        }
      }
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [accessibilitySettings.voiceGuidance]);

  const speakImmediately = useCallback((text) => {
    if (!text || typeof text !== 'string') return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
    }
  }, []);

  const speak = useCallback((text) => {
    if (!accessibilitySettings.voiceGuidance) return;
    if (!text || typeof text !== 'string') return;

    // Prevent duplicate speech within 500ms
    const now = Date.now();
    if (text === lastSpokenRef.current && now - lastSpokenTimeRef.current < 500) {
      return;
    }
    lastSpokenRef.current = text;
    lastSpokenTimeRef.current = now;

    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    if (!voicesLoaded) {
      utteranceQueueRef.current.push(text);
      return;
    }

    speakImmediately(text);
  }, [accessibilitySettings.voiceGuidance, voicesLoaded, speakImmediately]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Get readable text from an element
  const getElementText = useCallback((element) => {
    // Check for aria-label first
    if (element.getAttribute('aria-label')) {
      return element.getAttribute('aria-label');
    }

    // Check for title attribute
    if (element.getAttribute('title')) {
      return element.getAttribute('title');
    }

    // Check for data-voice attribute (custom attribute for voice guidance)
    if (element.getAttribute('data-voice')) {
      return element.getAttribute('data-voice');
    }

    // Get text content
    const textContent = element.textContent?.trim();
    if (textContent && textContent.length < 200) {
      return textContent;
    }

    // Check for placeholder in inputs
    if (element.placeholder) {
      return element.placeholder;
    }

    // Check for alt text in images
    if (element.alt) {
      return element.alt;
    }

    return null;
  }, []);

  // Global event listeners for voice guidance
  useEffect(() => {
    if (!accessibilitySettings.voiceGuidance) return;

    const handleFocus = (event) => {
      const element = event.target;
      const tagName = element.tagName.toLowerCase();

      // Interactive elements that should be read
      const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
      const isInteractive = interactiveElements.includes(tagName) ||
        element.getAttribute('role') === 'button' ||
        element.getAttribute('tabindex') !== null;

      if (isInteractive) {
        let text = getElementText(element);

        // Add context based on element type
        if (tagName === 'input') {
          const inputType = element.type || 'text';
          const label = document.querySelector(`label[for="${element.id}"]`);
          const labelText = label ? label.textContent.trim() : '';

          if (inputType === 'checkbox') {
            const checked = element.checked ? 'checked' : 'unchecked';
            text = `${labelText || text || 'Checkbox'}, ${checked}`;
          } else if (inputType === 'radio') {
            const checked = element.checked ? 'selected' : 'not selected';
            text = `${labelText || text || 'Radio button'}, ${checked}`;
          } else {
            text = `${labelText || text || 'Text field'}${element.value ? `, current value: ${element.value}` : ''}`;
          }
        } else if (tagName === 'select') {
          const label = document.querySelector(`label[for="${element.id}"]`);
          const labelText = label ? label.textContent.trim() : '';
          const selectedOption = element.options[element.selectedIndex]?.text || '';
          text = `${labelText || 'Dropdown'}, selected: ${selectedOption}`;
        } else if (tagName === 'a') {
          text = text ? `Link: ${text}` : 'Link';
        } else if (tagName === 'button' || element.getAttribute('role') === 'button') {
          text = text ? `Button: ${text}` : 'Button';
        }

        if (text) {
          speak(text);
        }
      }
    };

    const handleClick = (event) => {
      const element = event.target.closest('button, a, [role="button"]');
      if (!element) return;

      const text = getElementText(element);
      if (text) {
        // For navigation links, announce where we're going
        if (element.tagName.toLowerCase() === 'a' && element.href) {
          speak(`Navigating to ${text}`);
        }
      }
    };

    // Add listeners
    document.addEventListener('focusin', handleFocus, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('focusin', handleFocus, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [accessibilitySettings.voiceGuidance, speak, getElementText]);

  // Announce page changes
  useEffect(() => {
    if (!accessibilitySettings.voiceGuidance) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check for main content changes (page navigation)
          const mainElement = document.querySelector('main');
          if (mainElement && mutation.target === mainElement.parentElement) {
            // Get page title from h1 or document title
            setTimeout(() => {
              const h1 = document.querySelector('main h1');
              const pageTitle = h1?.textContent?.trim() || document.title;
              if (pageTitle) {
                speak(`Page loaded: ${pageTitle}`);
              }
            }, 100);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [accessibilitySettings.voiceGuidance, speak]);

  return (
    <VoiceGuidanceContext.Provider value={{ speak, stopSpeaking, voicesLoaded }}>
      {children}
    </VoiceGuidanceContext.Provider>
  );
};

export default VoiceGuidanceContext;
