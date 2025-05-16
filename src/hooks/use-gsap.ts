
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type GSAPTarget = string | Element | Element[] | NodeList | null;
type GSAPVars = gsap.TweenVars;

/**
 * Hook to create GSAP animations
 */
export function useGSAP() {
  // Changed Timeline to timeline (lowercase)
  const animations = useRef<gsap.core.Timeline[]>([]);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      animations.current.forEach(animation => {
        if (animation.isActive()) {
          animation.kill();
        }
      });
    };
  }, []);

  /**
   * Create a simple tween animation
   */
  const animate = (target: GSAPTarget, vars: GSAPVars, delay: number = 0) => {
    const animation = gsap.to(target, { ...vars, delay });
    return animation;
  };

  /**
   * Create a fade-in animation
   */
  const fadeIn = (target: GSAPTarget, duration: number = 0.5, delay: number = 0) => {
    const animation = gsap.fromTo(
      target,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration, delay, ease: "power3.out" }
    );
    animations.current.push(animation);
    return animation;
  };

  /**
   * Create a fade-out animation
   */
  const fadeOut = (target: GSAPTarget, duration: number = 0.5, delay: number = 0) => {
    const animation = gsap.to(
      target,
      { opacity: 0, y: -20, duration, delay, ease: "power3.in" }
    );
    animations.current.push(animation);
    return animation;
  };

  /**
   * Create a staggered animation for lists
   */
  const stagger = (
    targets: GSAPTarget,
    vars: GSAPVars,
    staggerAmount: number = 0.1,
    delay: number = 0
  ) => {
    const animation = gsap.to(targets, {
      ...vars,
      stagger: staggerAmount,
      delay,
    });
    animations.current.push(animation);
    return animation;
  };

  /**
   * Create a timeline of animations
   */
  const createTimeline = (defaults: gsap.TimelineVars = {}) => {
    const timeline = gsap.timeline(defaults);
    animations.current.push(timeline);
    return timeline;
  };

  return {
    gsap,
    animate,
    fadeIn,
    fadeOut,
    stagger,
    createTimeline,
  };
}
