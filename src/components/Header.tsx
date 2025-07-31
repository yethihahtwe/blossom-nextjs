'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CompactAnnouncementBanner } from './announcement-banner';

const Header = () => {
  const pathname = usePathname();
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
            <li><Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link href="/#about">About Us</Link></li>
            <li><Link href="/#programs">Programs</Link></li>
            <li><Link href="/news" className={pathname === '/news' ? 'active' : ''}>News</Link></li>
            <li><Link href="/announcements" className={pathname === '/announcements' ? 'active' : ''}>Announcements</Link></li>
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

export default Header;