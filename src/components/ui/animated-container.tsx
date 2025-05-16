
import React, { useRef, useEffect } from "react";
import { useGSAP } from "@/hooks/use-gsap";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: "fade" | "slide" | "scale" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: boolean;
  staggerAmount?: number;
  from?: Record<string, any>; // Custom GSAP from properties
  to?: Record<string, any>; // Custom GSAP to properties
  triggerOnce?: boolean;
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
}: AnimatedContainerProps) {
  const { gsap, createTimeline } = useGSAP();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (containerRef.current && (!triggerOnce || !hasAnimated.current)) {
      const elements = stagger 
        ? containerRef.current.children 
        : containerRef.current;
      
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
          case "fade":
            fromVars = { opacity: 0, y: 20, ...fromVars };
            toVars = { opacity: 1, y: 0, ...toVars };
            break;
          case "slide":
            fromVars = { x: -50, opacity: 0, ...fromVars };
            toVars = { x: 0, opacity: 1, ...toVars };
            break;
          case "scale":
            fromVars = { scale: 0.8, opacity: 0, ...fromVars };
            toVars = { scale: 1, opacity: 1, ...toVars };
            break;
          case "none":
          default:
            // No animation
            break;
        }
      }
      
      const tl = createTimeline({ delay });
      
      if (stagger) {
        tl.from(elements, {
          ...fromVars,
          stagger: staggerAmount,
        }).to(elements, {
          ...toVars,
          stagger: staggerAmount,
        });
      } else {
        tl.from(elements, fromVars).to(elements, toVars);
      }
      
      hasAnimated.current = true;
    }
  }, [animation, delay, duration, stagger, staggerAmount, from, to, createTimeline, triggerOnce]);
  
  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
