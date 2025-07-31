import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { AnnouncementBanner } from "@/components/announcement-banner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="main-content" role="main">
        {/* Announcement Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AnnouncementBanner />
        </div>
        
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
