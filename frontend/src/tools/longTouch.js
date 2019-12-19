import { useState, useEffect, useCallback } from 'react';

export function useLongTouch(callback = (ev) => {}, ms = 300) {
  const [startLongTouch, setStartLongTouch] = useState([false, null]);

  useEffect(() => {
    let timerId;
    if (startLongTouch[0]) {
      timerId = setTimeout(callback.bind(null, startLongTouch[1]), ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongTouch]);

  const start = useCallback((ev) => {
    ev.persist();
    setStartLongTouch([true, ev]);
  }, []);
  const stop = useCallback(() => {
    setStartLongTouch([false, null]);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
