'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import { allPostsQuery } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  _id: string;
  title: string;
  slug: string;
  coverImage: {
    asset: {
      url: string;
    };
  };
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await client.fetch(allPostsQuery);
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link 
              href={`/${project.slug}`} 
              key={project._id}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="relative h-48 w-full">
                  {project.coverImage && (
                    <Image
                      src={project.coverImage.asset.url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-900 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 