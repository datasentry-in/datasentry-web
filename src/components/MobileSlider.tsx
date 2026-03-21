'use client';
import { useState, useEffect, useRef, ReactNode } from 'react';

interface MobileSliderProps {
  children: ReactNode[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

export default function MobileSlider({ children, autoSlide = false, autoSlideInterval = 4000 }: MobileSliderProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = children.length;

  useEffect(() => {
    if (autoSlide && total > 1) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % total);
      }, autoSlideInterval);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [autoSlide, autoSlideInterval, total]);

  return (
    <div className="relative">
      {/* Slide container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {children.map((child, i) => (
            <div key={i} className="w-full shrink-0 px-1">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 border border-black transition-all ${
              i === current ? 'bg-primary scale-125' : 'bg-gray-300'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
