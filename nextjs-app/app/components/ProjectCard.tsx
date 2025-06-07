'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

interface Project {
  _id: string;
  status: 'draft' | 'published';
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: {
    asset?: {
      _ref: string;
      _type: 'reference';
      _weak?: boolean;
    };
    hotspot?: any;
    crop?: any;
  };
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
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

  const imageUrl = project.coverImage ? urlForImage(project.coverImage)?.url() : null;

  return (
    <Link href={`/project/${project.slug}`} className="block">
      <div
        ref={cardRef}
        className="metallic-card2 bubble-card2 h-full rounded-2xl"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px)',
          willChange: 'transform',
          position: 'relative',
          transition: 'transform 0.4s ease-out',
        }}
      >
        <div style={{...lightStyle, transition: 'opacity 0.3s ease-out'}} />
        <div className="relative h-48 w-full overflow-hidden -mt-2" style={{ transform: 'translateZ(20px)' }}>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover rounded-xl"
            />
          )}
        </div>
        <div className="p-6" style={{ transform: 'translateZ(20px)' }}>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-950 to-black bg-clip-text text-transparent">
            {project.title}
          </h3>
          {project.excerpt && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {project.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
} 