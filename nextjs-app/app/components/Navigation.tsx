'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function NavigationContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > window.innerHeight * 0.25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash-based navigation
  useEffect(() => {
    if (isHomePage) {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Small delay to ensure the page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [isHomePage, pathname]);

  const handleNavigation = (section: string) => {
    if (isHomePage) {
      // If on home page, just scroll to section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home page and then scroll to section
      router.push(`/#${section}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Arbiter Logo/Primary Logo/Logo-primary-edited.png"
              alt="Arbiter PM Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('services')}
              className="text-gray-800 hover:text-purple-900 transition-colors font-bold"
            >
              Services
            </button>
            <button
              onClick={() => handleNavigation('projects')}
              className="text-gray-800 hover:text-purple-900 transition-colors font-bold"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavigation('contact')}
              className="text-gray-800 hover:text-purple-900 transition-colors font-bold"
            >
              Contact
            </button>
            <Link
              href="/sitemap"
              className="text-gray-800 hover:text-purple-900 transition-colors font-bold"
            >
              Sitemap
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
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
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/80 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  handleNavigation('services');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-800 hover:text-purple-900 transition-colors font-bold"
              >
                Services
              </button>
              <button
                onClick={() => {
                  handleNavigation('projects');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-800 hover:text-purple-900 transition-colors font-bold"
              >
                Projects
              </button>
              <button
                onClick={() => {
                  handleNavigation('contact');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-800 hover:text-purple-900 transition-colors font-bold"
              >
                Contact
              </button>
              <Link
                href="/sitemap"
                className="block w-full text-left px-3 py-2 text-gray-800 hover:text-purple-900 transition-colors font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sitemap
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function Navigation() {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <NavigationContent />
    </Suspense>
  );
} 