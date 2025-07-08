import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact Information</h3>
            <ul>
              <li>Thatipahtan Street, Myingyan, Myanmar</li>
              <li>Phone: +95 9 45126 2018</li>
              <li>Email: info@blossom.edu.mm</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="#about">About Us</Link></li>
              <li><Link href="#programs">Programs</Link></li>
              <li><Link href="/admissions">Admissions</Link></li>
              <li><Link href="/news">News</Link></li>
              <li><Link href="#contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <ul>
              <li><Link href="#" target="_blank">Facebook</Link></li>
              <li><Link href="#" target="_blank">Twitter</Link></li>
              <li><Link href="#" target="_blank">Instagram</Link></li>
              <li><Link href="#" target="_blank">YouTube</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Blossom Private School. All rights reserved.</p>
          <p>Committed to nurturing young minds where every child blooms.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;