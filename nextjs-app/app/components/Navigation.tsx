'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > window.innerHeight * 0.25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-24 backdrop-blur-xl bg-white/70 border-b border-white/20 px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/Arbiter Logo/Primary Logo/Logo-primary.png"
              alt="Arbiter PM Logo"
              width={300}
              height={150}
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link href="#services" className="text-white hover:text-purple-400 transition-colors text-lg">
              Services
            </Link>
            <Link href="#projects" className="text-white hover:text-purple-400 transition-colors text-lg">
              Projects
            </Link>
            <Link href="#contact" className="text-white hover:text-purple-400 transition-colors text-lg">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden backdrop-blur-xl bg-white/40 transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
          } overflow-hidden`}
        >
          <div className="flex flex-col space-y-6 p-6">
            <Link
              href="#services"
              className="text-white hover:text-purple-400 transition-colors text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#projects"
              className="text-white hover:text-purple-400 transition-colors text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="#contact"
              className="text-white hover:text-purple-400 transition-colors text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 