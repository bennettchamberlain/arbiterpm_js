'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export default function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const splitText = new SplitText(textRef.current, { type: 'chars,words' });
      const chars = splitText.chars;

      gsap.from(chars, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.02,
        ease: 'power4.out',
        delay: 0.5
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
    >
      <div
        ref={textRef}
        className="text-white space-y-4"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          YOUR VISION, OUR EXPERTISE.
        </h1>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide">
          BESPOKE DIGITAL TRANSFORMATIONS.
        </h2>
      </div>
    </div>
  );
} 