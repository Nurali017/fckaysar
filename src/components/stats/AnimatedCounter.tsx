/**
 * AnimatedCounter - Animated number counting effect
 * Numbers smoothly count up from 0 to target value
 */

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  startOnView?: boolean;
}

// Easing function for smooth deceleration at the end
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const AnimatedCounter = ({
  value,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  startOnView = true,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const countRef = useRef(0);
  const lastTargetRef = useRef<number | null>(null);

  useEffect(() => {
    // Only start when in view (if startOnView is true)
    if (startOnView && !isInView) return;

    // Skip if we're already at the target value
    if (lastTargetRef.current === value && countRef.current === value) return;

    lastTargetRef.current = value;
    const startValue = countRef.current;
    const targetValue = value;
    let startTime: number | null = null;
    let animationFrame: number;
    let cancelled = false;

    const animate = (currentTime: number) => {
      if (cancelled) return;
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutExpo(progress);
      const currentValue = startValue + (targetValue - startValue) * easedProgress;

      countRef.current = currentValue;
      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, isInView, startOnView]);

  // Format the number with proper decimals
  const formattedValue = count.toFixed(decimals);

  // Add thousand separators
  const [intPart, decPart] = formattedValue.split('.');
  const formattedInt = parseInt(intPart).toLocaleString('ru-RU');
  const displayValue = decPart ? `${formattedInt}.${decPart}` : formattedInt;

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

// Preset for percentage display
interface AnimatedPercentageProps {
  value: number;
  duration?: number;
  className?: string;
  color?: 'red' | 'green' | 'yellow' | 'white';
}

const colorClasses = {
  red: 'text-red-500',
  green: 'text-green-500',
  yellow: 'text-yellow-500',
  white: 'text-white',
};

export const AnimatedPercentage = ({
  value,
  duration = 2000,
  className,
  color = 'white',
}: AnimatedPercentageProps) => {
  return (
    <AnimatedCounter
      value={value}
      duration={duration}
      decimals={0}
      suffix="%"
      className={cn(colorClasses[color], className)}
    />
  );
};

// Preset for large hero numbers
interface HeroCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color?: 'red' | 'green' | 'yellow' | 'blue' | 'white';
}

export const HeroCounter = ({
  value,
  label,
  prefix,
  suffix,
  decimals = 0,
  color = 'white',
}: HeroCounterProps) => {
  return (
    <div className="text-center">
      <AnimatedCounter
        value={value}
        duration={2500}
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        className={cn(
          'text-5xl md:text-6xl lg:text-7xl font-black block',
          colorClasses[color]
        )}
      />
      {label && (
        <span className="block mt-2 text-xs md:text-sm text-gray-400 uppercase tracking-wider font-bold">
          {label}
        </span>
      )}
    </div>
  );
};
