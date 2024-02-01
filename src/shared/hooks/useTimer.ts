import { useState, useEffect } from 'react';

// TODO: refactor to remove rerenders

export function useTimer(initialMilliseconds: number) {
  const [milliseconds, setMilliseconds] = useState(initialMilliseconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const start = () => {
    setIsRunning(true);
    setIsExpired(false);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const restart = () => {
    setMilliseconds(initialMilliseconds);
    start();
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setInterval> | undefined = undefined;

    if (!isRunning) {
      clearInterval(timeoutId);
      return;
    }

    timeoutId = setInterval(() => {
      setMilliseconds((prevMilliseconds) => {
        const nextMs = prevMilliseconds - 1000;
        if (nextMs < 0) {
          setIsExpired(true);
          stop();

          return 0;
        }

        return nextMs;
      });
    }, 1000);

    return () => {
      clearInterval(timeoutId);
    };
  }, [isRunning]);

  return {
    milliseconds,
    isExpired,
    start,
    stop,
    restart,
  };
}
