'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CompactAnnouncementBanner } from './announcement-banner';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>('');

  // Clear loading state when pathname changes
  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Track hash changes and scroll position for anchor links
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = ['about', 'programs', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveHash(`#${section}`);
            return;
          }
        }
      }

      // If not in any section, clear hash (likely at top of page)
      if (window.scrollY < 100) {
        setActiveHash('');
      }
    };

    // Set initial hash
    handleHashChange();

    // Add event listeners
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if an anchor link should be active
  const isAnchorActive = (hash: string) => {
    // Only show active on home page
    if (pathname !== '/') return false;
    return activeHash === hash;
  };

  return (
    <>
      {/* Urgent Announcement Banner */}
      <CompactAnnouncementBanner />
      
      <header className="site-header" role="banner">
      <div className="header-content">
        {/* Site Logo and Title */}
        <div className="site-branding">
          <Link href="/" className="site-logo">
            <Image
              src="/blossom-logo.png"
              alt="Blossom Private School"
              width={40}
              height={40}
            />
          </Link>
          <div className="site-info">
            <Link href="/" className="site-title">Blossom Private School</Link>
            <div className="site-tagline">Excellence in Education</div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className={`main-navigation ${mobileMenuOpen ? 'mobile-open' : ''}`} role="navigation">
          <ul className="nav-menu">
            <li>
              <NavLink href="/" currentPath={pathname} loadingHref={loadingHref} setLoadingHref={setLoadingHref} router={router}>
                Home
              </NavLink>
            </li>
            <li>
              <Link 
                href="/#about"
                className={isAnchorActive('#about') ? 'active' : ''}
                onClick={(e) => {
                  if (pathname !== '/') {
                    e.preventDefault();
                    router.push('/#about');
                  }
                }}
                style={{
                  color: isAnchorActive('#about') ? 'var(--primary-color)' : undefined
                }}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                href="/#programs"
                className={isAnchorActive('#programs') ? 'active' : ''}
                onClick={(e) => {
                  if (pathname !== '/') {
                    e.preventDefault();
                    router.push('/#programs');
                  }
                }}
                style={{
                  color: isAnchorActive('#programs') ? 'var(--primary-color)' : undefined
                }}
              >
                Programs
              </Link>
            </li>
            <li>
              <NavLink href="/news" currentPath={pathname} loadingHref={loadingHref} setLoadingHref={setLoadingHref} router={router}>
                News
              </NavLink>
            </li>
            <li>
              <NavLink href="/announcements" currentPath={pathname} loadingHref={loadingHref} setLoadingHref={setLoadingHref} router={router}>
                Announcements
              </NavLink>
            </li>
            <li>
              <Link 
                href="/#contact"
                className={isAnchorActive('#contact') ? 'active' : ''}
                onClick={(e) => {
                  if (pathname !== '/') {
                    e.preventDefault();
                    router.push('/#contact');
                  }
                }}
                style={{
                  color: isAnchorActive('#contact') ? 'var(--primary-color)' : undefined
                }}
              >
                Contact
              </Link>
            </li>
          </ul>
          <Link 
            href="/admissions" 
            className={`apply-now-btn ${pathname === '/admissions' ? 'active' : ''}`}
          >
            Apply Now
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
    </>
  );
};

// NavLink component for handling loading states
interface NavLinkProps {
  href: string;
  currentPath: string;
  loadingHref: string | null;
  setLoadingHref: (href: string | null) => void;
  router: ReturnType<typeof useRouter>;
  children: React.ReactNode;
}

const NavLink = ({ href, currentPath, loadingHref, setLoadingHref, router, children }: NavLinkProps) => {
  // Improved active state detection
  let isActive = false;
  
  if (href === '/') {
    // For home page, only active when exactly on home page
    isActive = currentPath === '/';
  } else {
    // For other pages, active when on exact page or subpages
    isActive = currentPath === href || currentPath.startsWith(href + '/');
  }
  
  const isLoading = loadingHref === href;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isActive) return; // Don't navigate if already on this page
    
    setLoadingHref(href);
    router.push(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={isActive ? 'active' : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: isActive ? 'var(--primary-color)' : undefined
      }}
    >
      {children}
      {isLoading && (
        <svg
          className="loading-spinner"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            animation: 'spin 1s linear infinite',
            opacity: 0.7
          }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            style={{
              animation: 'spin-dash 1.5s ease-in-out infinite'
            }}
          />
        </svg>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `}</style>
    </Link>
  );
};

export default Header;