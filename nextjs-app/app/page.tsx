'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from './components/Navigation';
import HeroText from './components/HeroText';
import LoadingScreen from './components/LoadingScreen';
import ServicesBox from './components/ServicesBox';

// Dynamically import SpaceScene to avoid SSR issues with Three.js
const SpaceScene = dynamic(() => import('./components/three/SpaceScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed top-0 left-0 w-full h-screen bg-black flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  ),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="relative min-h-screen bg-black">
      {isLoading ? (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <SpaceScene />
          <Navigation />
          <div className="relative z-10 min-h-screen flex flex-col items-center pt-24">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white text-center mb-6">
              Bespoke Digital Transformations
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white text-center">
              Website and App Development
            </h2>
          </div>

          <section id="services" className="min-h-screen relative z-10">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-12">
              <h5 className="text-4xl md:text-5xl lg:text-6xl font-light text-white text-center">Your Vision, Our Execution</h5>
              <ServicesBox />
            </div>
          </section>

          <section id="projects" className="min-h-screen relative z-10">
            <div className="container mx-auto px-4 py-20">
              <h2 className="text-4xl font-bold text-white mb-8">Our Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project cards will go here */}
              </div>
            </div>
          </section>

          <section id="contact" className="min-h-screen relative z-10">
            <div className="container mx-auto px-4 py-20">
              <h2 className="text-4xl font-bold text-white mb-8">Contact Us</h2>
              <div className="max-w-2xl mx-auto">
                {/* Contact form will go here */}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
} 