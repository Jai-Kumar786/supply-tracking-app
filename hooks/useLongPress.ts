'use client';

import { useRef, useCallback } from 'react';
import { LONG_PRESS_DELAY, LONG_PRESS_INTERVAL } from '@/utils/constants';

export function useLongPress(callback: () => void, onRelease?: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Tracks whether the current interaction started via touch.
  // On mobile, after touchstart/touchend, the browser synthesizes
  // mousedown/mouseup/click — we ignore those to prevent double-firing.
  const isTouchRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
    onRelease?.();
  }, [onRelease]);

  const start = useCallback(() => {
    callback(); // immediate single fire
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(callback, LONG_PRESS_INTERVAL);
    }, LONG_PRESS_DELAY);
  }, [callback]);

  return {
    onMouseDown: (e: React.MouseEvent) => {
      // Suppress the synthetic mouse event that follows a real touch
      if (isTouchRef.current) return;
      start();
    },
    onMouseUp: (e: React.MouseEvent) => {
      if (isTouchRef.current) return;
      clear();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      if (isTouchRef.current) return;
      clear();
    },
    onTouchStart: (e: React.TouchEvent) => {
      isTouchRef.current = true;
      start();
    },
    onTouchEnd: (e: React.TouchEvent) => {
      clear();
      // Reset the touch flag after a short delay so it doesn't
      // block legitimate mouse events on hybrid pointer devices.
      setTimeout(() => { isTouchRef.current = false; }, 500);
    },
    onTouchCancel: (e: React.TouchEvent) => {
      clear();
      setTimeout(() => { isTouchRef.current = false; }, 500);
    },
  };
}
