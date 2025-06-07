'use client';

import { useEffect, useState } from 'react';
import { getProjects } from '../actions/projects';
import ProjectCard from './ProjectCard';

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

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <section id="projects" className="relative z-10 mt-8">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white text-center mb-12">Our Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="metallic-card bubble-card animate-pulse">
                <div className="h-48 bg-gray-200/20" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200/20 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative z-10 mt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white text-center mb-12">Our Projects</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
} 