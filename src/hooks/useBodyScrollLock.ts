import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling when a modal or pop-up is open,
 * and restore it when closed.
 */
export function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
}
