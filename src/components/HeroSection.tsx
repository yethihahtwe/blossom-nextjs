'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { src: '/slider-01.png', alt: 'Blossom Private School' },
    { src: '/slider-02.png', alt: 'Campus Life' },
    { src: '/slider-03.png', alt: 'Academic Excellence' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-section">
      {/* Cloud decoration */}
      <div className="cloud-decoration">
        <Image src="/cloud.png" alt="Cloud" width={120} height={80} className="cloud-img" />
      </div>

      {/* Educational decorations */}
      <div className="educational-decorations">
        <div className="edu-item cube-decoration">
          <Image src="/cube.png" alt="Cube" width={100} height={100} className="cube-img" />
        </div>
        <div className="edu-item flask-decoration">
          <Image src="/flask.png" alt="Flask" width={90} height={90} className="flask-img" />
        </div>
        <div className="edu-item book-space">
          {/* Space reserved for book image */}
        </div>
        <div className="edu-item bulb-decoration">
          <Image src="/bulb.png" alt="Light Bulb" width={95} height={95} className="bulb-img" />
        </div>
      </div>

      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hero-logos">
              <Image 
                src="/logo_dark_mode.png" 
                alt="Blossom Logo" 
                width={70} 
                height={70}
                className="blossom-logo"
              />
              <Image 
                src="/cambridge_dark_mode.png" 
                alt="Cambridge Qualifications" 
                width={70} 
                height={70}
                className="cambridge-logo"
              />
            </div>
            <h1>BLOSSOM:</h1>
            <div className="tagline">Where every child blooms</div>
            <div className="school-info">BLOSSOM PRIVATE SCHOOL | MYINGYAN</div>
          </div>
          
          <div className="hero-image" style={{ width: '85%', height: '350px', margin: '0 auto' }}>
            <div className="hero-slider" style={{ width: '100%', height: '350px' }}>
              <div className="slider-container" style={{ width: '100%', height: '350px' }}>
                {/* Slides */}
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ width: '100%', height: '350px' }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={600}
                      height={350}
                      className="hero-img"
                      style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button className="slider-nav slider-prev" onClick={prevSlide}>‹</button>
              <button className="slider-nav slider-next" onClick={nextSlide}>›</button>

              {/* Dots */}
              <div className="slider-dots">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
            
            {/* Pencil decoration - moved outside slider */}
            <div className="pencil-decoration">
              <Image src="/pencil.png" alt="Pencil" width={100} height={100} className="pencil-img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;