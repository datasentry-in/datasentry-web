'use client';
import { useState, useEffect, ReactNode, Children } from 'react';
import MobileSlider from './MobileSlider';

interface ResponsiveSliderProps {
  children: ReactNode;
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

export default function ResponsiveSlider({
  children,
  autoSlide = false,
  autoSlideInterval = 4000,
}: ResponsiveSliderProps) {
  const [isMobile, setIsMobile] = useState(true);
  const items = Children.toArray(children);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <MobileSlider autoSlide={autoSlide} autoSlideInterval={autoSlideInterval}>
        {items}
      </MobileSlider>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {items}
    </div>
  );
}
