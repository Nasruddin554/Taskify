
import { useEffect, useState } from 'react';

interface GSAPHook {
  gsap: typeof import('gsap').gsap | null;
  timeline: (() => import('gsap').TimelineMax) | null;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null;
}

export function useGSAP(): GSAPHook {
  const [gsapInstance, setGsapInstance] = useState<GSAPHook>({
    gsap: null,
    timeline: null,
    ScrollTrigger: null
  });

  useEffect(() => {
    let mounted = true;

    const loadGSAP = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        
        gsap.registerPlugin(ScrollTrigger);
        
        if (mounted) {
          setGsapInstance({
            gsap,
            timeline: () => gsap.timeline(),
            ScrollTrigger
          });
        }
      } catch (error) {
        console.error('Failed to load GSAP:', error);
      }
    };

    loadGSAP();

    return () => {
      mounted = false;
    };
  }, []);

  return gsapInstance;
}
