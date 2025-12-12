import { useEffect } from 'react';

/**
 * Custom hook to lock body scroll when a modal is open.
 * Automatically restores the original overflow value on unmount.
 */
export function useModalScrollLock() {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
}
