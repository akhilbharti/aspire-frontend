
import { useEffect, useRef } from "react";

export function useFocusTrap(isActive: boolean) {
  const focusRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      // Store the current active element
      previouslyFocused.current = document.activeElement as HTMLElement;
      
      // Focus the container
      if (focusRef.current) {
        focusRef.current.focus({ preventScroll: true });
      }
      
      // Handle tab navigation
      const handleTabKey = (e: KeyboardEvent) => {
        if (!focusRef.current || e.key !== 'Tab') return;
        
        const focusableElements = focusRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey) {
          // If shift+tab pressed and first element is focused, move to last element
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // If tab pressed and last element is focused, move to first element
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    } else if (previouslyFocused.current) {
      // Return focus when sheet closes
      previouslyFocused.current.focus();
      previouslyFocused.current = null;
    }
  }, [isActive]);

  return { focusRef };
}
