import React from 'react';
import './Footer.css';

// Font Awesome imports
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFacebook} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="footer">
            {/* Left: Facebook icon */}
            <div className="footer-facebook">
                <a href="https://www.facebook.com/people/New-Looker/pfbid0pJnSRHzZi73GAV5pdCGZpVHHRhub9HJYA1GNqenZ2Zgd1rrYfpjZ118oYehCPCVgl/"
                   target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebook} size="2x"/>
                </a>
            </div>

            {/* Other footer info */}
            <div className="footer-item">
                <strong>Address:</strong> 123 Main Street, City, Country
            </div>
            <div className="footer-item">
                <strong>Email:</strong> <a href="mailto:info@example.com">info@example.com</a>
            </div>
            <div className="footer-item">
                <strong>Phone:</strong> <a href="tel:+1234567890">+1 234 567 890</a>
            </div>
        </footer>
    );
};

export default Footer;
