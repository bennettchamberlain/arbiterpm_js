'use client';

import { useRef, useEffect } from 'react';

export default function ServicesBox() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation based on mouse position relative to center
      // Reversed both X and Y calculations for consistent downward tilt
      const rotateX = ((centerY - y) / centerY) * 5; // Max 5 degrees
      const rotateY = ((x - centerX) / centerX) * 5; // Max 5 degrees
      
      // Apply the transform with a smooth transition
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.01, 1.01, 1.01)
      `;
    };

    const handleMouseLeave = () => {
      // Smoothly return to original position
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    const handleMouseEnter = () => {
      // Add a very subtle initial tilt when mouse enters
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1.005, 1.005, 1.005)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="w-full max-w-3xl backdrop-blur-xl bg-white/70 rounded-2xl p-8 md:p-12 border border-white/20 transition-all duration-300 ease-out shadow-2xl"
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px)',
        willChange: 'transform',
      }}
    >
      <div className="space-y-6" style={{ transform: 'translateZ(20px)' }}>
        <h3 className="text-2xl md:text-3xl font-bold text-white">
          SERVICES
        </h3>
        <h4 className="text-xl md:text-2xl font-medium bg-gradient-to-r from-purple-900 to-black bg-clip-text text-transparent">
          We provide design &<br />
          development services
        </h4>
        <p className="text-lg bg-gradient-to-r from-purple-900 to-black bg-clip-text text-transparent leading-relaxed">
          We collaborate with you at every stage, from initial concept and strategy to full execution and implementation.
        </p>
        
          <p className="text-lg bg-gradient-to-r from-purple-900 to-black bg-clip-text text-transparent font-medium">
            With over a decade of experience in software development, we bring deep technical expertise and industry best practices to every project.
          </p>
       
      </div>
    </div>
  );
} 