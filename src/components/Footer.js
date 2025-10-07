import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-item">
                <strong>Address:</strong> 123 Main Street, City, Country
            </div>
            <div className="footer-item">
                <strong>Email:</strong> <a href="mailto:info@example.com">info@example.com</a>
            </div>
            <div className="footer-item">
                <strong>Phone:</strong> <a href="tel:+1234567890">+1 234 567 890</a>
            </div>
            <div className="footer-item">
                <strong>Facebook:</strong> <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">facebook.com/yourpage</a>
            </div>
        </footer>
    );
};

export default Footer;
