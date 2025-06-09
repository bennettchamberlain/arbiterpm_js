'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const getLinkHref = (section: string) => {
    return isHomePage ? `#${section}` : `/#${section}`;
  };

  return (
    <footer className="relative bg-white/40 backdrop-blur-sm border-t border-white/20">
      <div className="container py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="w-full max-w-2xl">
            <div className="flex justify-center">
              <Image
                src="/Arbiter_Logo/Primary_Logo/Logo-primary-edited.png"
                alt="Arbiter PM Logo"
                width={200}
                height={100}
                className="h-12 w-auto sm:h-16"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href={getLinkHref('services')}
              className="text-gray-800 hover:text-purple-900 transition-colors font-bold"
            >
              Services
            </Link>
            <Link 
              href={getLinkHref('projects')}
              className="text-gray-800 hover:text-purple-900 transition-colors font-bold"
            >
              Projects
            </Link>
            <Link 
              href={getLinkHref('contact')}
              className="text-gray-800 hover:text-purple-900 transition-colors font-bold"
            >
              Contact
            </Link>
            <Link 
              href="/sitemap"
              className="text-gray-800 hover:text-purple-900 transition-colors font-bold"
            >
              Sitemap
            </Link>
          </div>

          {/* GitHub Button */}
          <a
            href="https://github.com/bennettchamberlain"
            className="group relative rounded-full overflow-hidden py-2 px-6 text-white transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black to-purple-600 group-hover:animate-gradient-x" />
            <span className="relative z-10">View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
