
import React, { useRef, useEffect, useState } from "react";
import { useGSAP } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: "fade" | "slide" | "scale" | "none" | "reveal";
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: boolean;
  staggerAmount?: number;
  from?: Record<string, any>; // Custom GSAP from properties
  to?: Record<string, any>; // Custom GSAP to properties
  triggerOnce?: boolean;
  threshold?: number; // Viewport threshold for triggering animation
  origin?: 'left' | 'right' | 'top' | 'bottom'; // Direction for reveal/slide animations
}

export function AnimatedContainer({
  children,
  animation = "fade",
  delay = 0,
  duration = 0.5,
  className,
  stagger = false,
  staggerAmount = 0.1,
  from,
  to,
  triggerOnce = true,
  threshold = 0.1,
  origin = 'bottom',
}: AnimatedContainerProps) {
  const { gsap, createTimeline, fadeIn, reveal } = useGSAP();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const inView = useInView(containerRef, threshold, triggerOnce);

  useEffect(() => {
    // Skip if already animated and triggerOnce is true
    if (triggerOnce && hasAnimated) return;
    
    // Only animate when in view 
    if (!inView || !containerRef.current) return;

    const elements = stagger 
      ? containerRef.current.children 
      : containerRef.current;
    
    // For simple animations, use our pre-built animation helpers
    if (animation === "fade" && !from && !to) {
      fadeIn(elements, duration, delay, 20);
      setHasAnimated(true);
      return;
    }
    
    if (animation === "reveal") {
      reveal(elements, duration, delay, origin);
      setHasAnimated(true);
      return;
    }
    
    // For custom animations, use the timeline approach
    let fromVars: Record<string, any> = {};
    let toVars: Record<string, any> = { duration, ease: "power2.out" };
    
    // Apply custom properties if provided
    if (from) {
      fromVars = { ...fromVars, ...from };
    }
    
    if (to) {
      toVars = { ...toVars, ...to };
    }
    
    // Set animation based on type if no custom properties
    if (!from) {
      switch (animation) {
        case "slide":
          const slideX = origin === 'left' ? -50 : origin === 'right' ? 50 : 0;
          const slideY = origin === 'top' ? -30 : origin === 'bottom' ? 30 : 0;
          fromVars = { x: slideX, y: slideY, opacity: 0, ...fromVars };
          toVars = { x: 0, y: 0, opacity: 1, ...toVars };
          break;
        case "scale":
          fromVars = { scale: 0.8, opacity: 0, ...fromVars };
          toVars = { scale: 1, opacity: 1, ...toVars };
          break;
        case "none":
        default:
          // No animation
          return;
      }
    }
    
    const tl = createTimeline({ delay });
    
    if (stagger) {
      tl.fromTo(elements, fromVars, {
        ...toVars,
        stagger: staggerAmount,
      });
    } else {
      tl.fromTo(elements, fromVars, toVars);
    }
    
    setHasAnimated(true);
  }, [animation, delay, duration, stagger, staggerAmount, from, to, inView, triggerOnce, hasAnimated, origin, fadeIn, reveal, createTimeline]);
  
  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
