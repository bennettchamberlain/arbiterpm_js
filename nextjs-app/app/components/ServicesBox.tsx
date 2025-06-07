'use client';

import { useRef, useEffect, useState } from 'react';

export default function ServicesBox() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [lightStyle, setLightStyle] = useState({});

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.01, 1.01, 1.01)
      `;

      // Calculate the angle and position for the slanted light line
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
      setLightStyle({
        opacity: 1,
        background: `linear-gradient(${angle}deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)`,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 2,
        transition: 'background 0.1s',
      });
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      setLightStyle({ opacity: 0 });
    };

    const handleMouseEnter = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1.005, 1.005, 1.005)';
      setLightStyle((prev) => ({ ...prev, opacity: 1 }));
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
      className="metallic-card bubble-card"
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px)',
        willChange: 'transform',
        position: 'relative',
        transition: 'transform 0.4s ease-out',
      }}
    >
      <div style={{...lightStyle, transition: 'opacity 0.3s ease-out'}} />
      <div className="space-y-6" style={{ transform: 'translateZ(20px)' }}>
        <h3 className="text-2xl md:text-3xl font-bold text-white">
          SERVICES
        </h3>
        <h4 className="text-xl md:text-2xl font-medium bg-gradient-to-r from-purple-950 to-black bg-clip-text text-transparent">
          We provide design &<br />
          development services
        </h4>
        <p className="text-lg bg-gradient-to-r from-purple-950 to-black bg-clip-text text-transparent leading-relaxed">
          We collaborate with you at every stage, from initial concept and strategy to full execution and implementation.
        </p>
        <p className="text-lg bg-gradient-to-r from-purple-950 to-black bg-clip-text text-transparent font-medium">
          With over a decade of experience in software development, we bring deep technical expertise and industry best practices to every project.
        </p>
      </div>
    </div>
  );
} 