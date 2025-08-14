import { useEffect, useState } from 'react';

/**
 * Hook to detect browser autofill using CSS animation events.
 * This technique works by applying a CSS animation to autofilled inputs
 * and listening for the animationstart event.
 * 
 * @param inputRef - Reference to the input element
 * @returns Object containing isAutofilled state and reset function
 */
export function useAutofillAnimationDetection(
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
) {
  const [isAutofilled, setIsAutofilled] = useState(false);

  useEffect(() => {
    const element = inputRef.current;
    if (!element) return;

    // Function to handle animation events
    const handleAnimation = (event: AnimationEvent) => {
      // Check if the animation name matches our autofill detection animations
      if (
        event.animationName === 'onAutoFillStart' ||
        event.animationName === 'onAutoFill'
      ) {
        setIsAutofilled(true);
      } else if (
        event.animationName === 'onAutoFillCancel' ||
        event.animationName === 'onAutoFillOut'
      ) {
        setIsAutofilled(false);
      }
    };

    // Add event listener for animation events
    element.addEventListener('animationstart', handleAnimation as EventListener);

    // Add the CSS for animation detection
    const style = document.createElement('style');
    style.textContent = `
      /* Chrome, Safari, Edge */
      @keyframes onAutoFill {
        from {}
        to {}
      }
      
      @keyframes onAutoFillCancel {
        from {}
        to {}
      }
      
      input:-webkit-autofill {
        animation-name: onAutoFill;
        animation-fill-mode: both;
      }
      
      input:not(:-webkit-autofill) {
        animation-name: onAutoFillCancel;
        animation-fill-mode: both;
      }
      
      /* Firefox */
      @keyframes onAutoFillStart {
        from {}
        to {}
      }
      
      @keyframes onAutoFillOut {
        from {}
        to {}
      }
      
      /* Firefox doesn't have a specific pseudo-class for autofill,
         but we can detect it by checking for the specific background color it applies */
      input:-moz-autofill {
        animation-name: onAutoFillStart;
        animation-fill-mode: both;
      }
      
      input:not(:-moz-autofill) {
        animation-name: onAutoFillOut;
        animation-fill-mode: both;
      }
    `;
    document.head.appendChild(style);

    // Clean up
    return () => {
      element.removeEventListener('animationstart', handleAnimation as EventListener);
      document.head.removeChild(style);
    };
  }, [inputRef]);

  // Function to reset the autofilled state
  const resetAutofilled = () => {
    setIsAutofilled(false);
  };

  return { isAutofilled, resetAutofilled };
}

