'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';
import ServicesBox from './components/ServicesBox';
import ProjectsList from './components/ProjectsList';
import Contact from './components/Contact';

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
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Check if this is the first visit using localStorage
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (hasVisitedBefore) {
      // If we've visited before, skip loading screen immediately
      setIsLoading(false);
      setHasLoaded(true);
    } else {
      // First visit - show loading screen and set localStorage
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasLoaded(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // If we've visited before, render the main content immediately
  if (hasLoaded) {
    return (
      <main className="relative min-h-screen bg-black">
        <SpaceScene />
        <Navigation />
        <div className="relative z-10 min-h-[80vh] flex flex-col items-center justify-start pt-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white text-center mb-6">
            Your Vision, Our Execution
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white text-center">
            Website and App Development
          </h2>
        </div>

        <section id="services" className="h-16"></section>
        <section className="relative z-10">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center space-y-12">
            <h5 className="text-4xl md:text-5xl lg:text-6xl font-light text-white text-center">Bespoke Digital Transformations</h5>
            <ServicesBox />
          </div>
        </section>

        <ProjectsList />
        <Contact />
      </main>
    );
  }

  // Only show loading screen on first visit
  return (
    <main className="relative min-h-screen bg-black">
      <LoadingScreen onLoadingComplete={() => {
        setIsLoading(false);
        setHasLoaded(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      }} />
    </main>
  );
} 