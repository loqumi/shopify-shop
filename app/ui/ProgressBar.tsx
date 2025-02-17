import {useEffect, useState} from 'react';

interface ProgressBarProps {
  duration: number;
  isActive: boolean;
  isFilled: boolean;
  key: string;
  onComplete: () => void;
}

export default function ProgressBar({
  duration,
  isActive,
  isFilled,
  onComplete,
}: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(isFilled ? 100 : 0);

    if (!isActive) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress === 100) {
        clearInterval(timer);
        onComplete();
      }
    }, 16);

    return () => clearInterval(timer);
  }, [duration, isActive, isFilled, onComplete]);

  return (
    <div className="h-0.5 rounded-full overflow-hidden relative">
      <div className="absolute inset-0 bg-white opacity-50" />
      <div
        className="h-full bg-white transition-all duration-100 ease-linear relative z-10"
        style={{width: `${progress}%`}}
      />
    </div>
  );
}
