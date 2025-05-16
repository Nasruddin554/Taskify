
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type GSAPTarget = string | Element | Element[] | NodeList | null;
type GSAPVars = gsap.TweenVars;

/**
 * Enhanced hook to create and manage GSAP animations with proper typing and cleanup
 */
export function useGSAP() {
  // Store both Tween and Timeline animations using a union type
  const animations = useRef<(gsap.core.Timeline | gsap.core.Tween)[]>([]);

  // Register an animation to be tracked for cleanup
  const registerAnimation = (animation: gsap.core.Timeline | gsap.core.Tween) => {
    animations.current.push(animation);
    return animation;
  };

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      animations.current.forEach(animation => {
        if (animation.isActive()) {
          animation.kill();
        }
      });
      animations.current = [];
    };
  }, []);

  /**
   * Create a simple tween animation
   */
  const animate = (target: GSAPTarget, vars: GSAPVars, delay: number = 0) => {
    const animation = gsap.to(target, { ...vars, delay });
    return registerAnimation(animation);
  };

  /**
   * Create a fade-in animation with optional y-offset
   */
  const fadeIn = (
    target: GSAPTarget, 
    duration: number = 0.5, 
    delay: number = 0, 
    yOffset: number = 20
  ) => {
    const animation = gsap.fromTo(
      target,
      { opacity: 0, y: yOffset },
      { opacity: 1, y: 0, duration, delay, ease: "power3.out" }
    );
    return registerAnimation(animation);
  };

  /**
   * Create a fade-out animation with optional y-offset
   */
  const fadeOut = (
    target: GSAPTarget, 
    duration: number = 0.5, 
    delay: number = 0, 
    yOffset: number = -20
  ) => {
    const animation = gsap.to(
      target,
      { opacity: 0, y: yOffset, duration, delay, ease: "power3.in" }
    );
    return registerAnimation(animation);
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
    return registerAnimation(animation);
  };

  /**
   * Create a timeline of animations
   */
  const createTimeline = (defaults: gsap.TimelineVars = {}) => {
    const timeline = gsap.timeline(defaults);
    return registerAnimation(timeline);
  };

  /**
   * Scroll-triggered animation
   * Requires ScrollTrigger plugin to be loaded
   */
  const scrollTrigger = (target: GSAPTarget, vars: GSAPVars, scrollConfig: any) => {
    if (!gsap.plugins?.ScrollTrigger) {
      console.warn('ScrollTrigger plugin is not loaded. Install it with: gsap.registerPlugin(ScrollTrigger)');
      return null;
    }
    
    const animation = gsap.to(target, {
      ...vars,
      scrollTrigger: scrollConfig,
    });
    return registerAnimation(animation);
  };

  /**
   * Create a reveal animation that shows elements as they enter the viewport
   */
  const reveal = (
    target: GSAPTarget, 
    duration: number = 0.8, 
    delay: number = 0,
    origin: 'left' | 'right' | 'top' | 'bottom' = 'bottom'
  ) => {
    // Define starting position based on origin
    const startProps: GSAPVars = { opacity: 0 };
    
    if (origin === 'left') startProps.x = -50;
    else if (origin === 'right') startProps.x = 50;
    else if (origin === 'top') startProps.y = -30;
    else startProps.y = 30; // bottom
    
    const animation = gsap.fromTo(
      target,
      startProps,
      { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        duration, 
        delay,
        ease: "power2.out" 
      }
    );
    
    return registerAnimation(animation);
  };

  return {
    gsap,
    animate,
    fadeIn,
    fadeOut,
    stagger,
    createTimeline,
    scrollTrigger,
    reveal,
    registerAnimation
  };
}
