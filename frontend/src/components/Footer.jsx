import React from 'react';
import '../public/styles/footer.css';

const Footer = () => {
  const footerLinks = [
    { text: 'Meta', href: '#' },
    { text: 'About', href: '#' },
    { text: 'Blog', href: '#' },
    { text: 'Jobs', href: '#' },
    { text: 'Help', href: '#' },
    { text: 'API', href: '#' },
    { text: 'Privacy', href: '#' },
    { text: 'Terms', href: '#' },
    { text: 'Locations', href: '#' },
    { text: 'Instagram Lite', href: '#' },
    { text: 'Meta AI', href: '#' },
    { text: 'Meta AI articles', href: '#' },
    { text: 'Threads', href: '#' },
    { text: 'Contact uploading and non-users', href: '#' },
    { text: 'Meta Verified', href: '#' }
  ];

  return (
    <footer className="instagram-footer">
      <div className="footer-content">
        <div className="footer-links">
          {footerLinks.map((link, index) => (
            <a key={index} href={link.href} className="footer-link">
              {link.text}
            </a>
          ))}
        </div>
        
        <div className="footer-bottom">
          <div className="language-selector">
            <select className="language-select">
              <option value="en">English (UK)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="zh">中文</option>
            </select>
          </div>
          
          <div className="copyright">
            <span>© 2025 Instagram from Meta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;