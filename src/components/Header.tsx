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

  // Clear loading state when pathname changes
  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);
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
        <nav className="main-navigation" role="navigation">
          <ul className="nav-menu">
            <li>
              <NavLink href="/" currentPath={pathname} loadingHref={loadingHref} setLoadingHref={setLoadingHref} router={router}>
                Home
              </NavLink>
            </li>
            <li><Link href="/#about">About Us</Link></li>
            <li><Link href="/#programs">Programs</Link></li>
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
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
          <Link href="/admissions" className="apply-now-btn">Apply Now</Link>
        </nav>

        {/* Mobile menu toggle */}
        <button className="mobile-menu-toggle">
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
  const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
  const isLoading = loadingHref === href;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isActive) return; // Don't navigate if already on this page
    
    setLoadingHref(href);
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`nav-link-button ${isActive ? 'active' : ''}`}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
        textDecoration: 'inherit',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
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
    </button>
  );
};

export default Header;