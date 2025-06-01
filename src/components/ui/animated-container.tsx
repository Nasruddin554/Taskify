
import { useRef, useEffect, ReactNode } from 'react';
import { useGSAP } from '@/hooks/use-gsap';
import { cn } from '@/lib/utils';

export type AnimationType = 
  | 'fade' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right'
  | 'scale'
  | 'reveal'
  | 'blur'
  | 'bounce';

export type OriginType = 'top' | 'bottom' | 'left' | 'right' | 'center';

interface AnimatedContainerProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  origin?: OriginType;
  className?: string;
  once?: boolean;
  trigger?: string;
}

export function AnimatedContainer({
  children,
  animation = 'fade',
  delay = 0,
  duration = 0.6,
  origin = 'center',
  className,
  once = true,
  trigger
}: AnimatedContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gsap } = useGSAP();

  useEffect(() => {
    if (!gsap || !containerRef.current) return;

    const element = containerRef.current;
    
    // Set initial state based on animation type
    const getInitialState = () => {
      switch (animation) {
        case 'fade':
          return { opacity: 0 };
        case 'slide-up':
          return { opacity: 0, y: 50 };
        case 'slide-down':
          return { opacity: 0, y: -50 };
        case 'slide-left':
          return { opacity: 0, x: 50 };
        case 'slide-right':
          return { opacity: 0, x: -50 };
        case 'scale':
          return { opacity: 0, scale: 0.8 };
        case 'reveal':
          return { opacity: 0, clipPath: 'inset(0 100% 0 0)' };
        case 'blur':
          return { opacity: 0, filter: 'blur(10px)' };
        case 'bounce':
          return { opacity: 0, scale: 0.3 };
        default:
          return { opacity: 0 };
      }
    };

    // Set final state
    const getFinalState = () => {
      switch (animation) {
        case 'fade':
          return { opacity: 1 };
        case 'slide-up':
        case 'slide-down':
          return { opacity: 1, y: 0 };
        case 'slide-left':
        case 'slide-right':
          return { opacity: 1, x: 0 };
        case 'scale':
          return { opacity: 1, scale: 1 };
        case 'reveal':
          return { opacity: 1, clipPath: 'inset(0 0% 0 0)' };
        case 'blur':
          return { opacity: 1, filter: 'blur(0px)' };
        case 'bounce':
          return { opacity: 1, scale: 1 };
        default:
          return { opacity: 1 };
      }
    };

    // Set initial state
    gsap.set(element, getInitialState());

    // Animate to final state
    const tween = gsap.to(element, {
      ...getFinalState(),
      duration,
      delay,
      ease: animation === 'bounce' ? 'back.out(1.7)' : 'power2.out'
    });

    return () => {
      tween.kill();
    };
  }, [gsap, animation, delay, duration, origin, once, trigger]);

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
