import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('main');

    const handleScroll = () => {
        const sections = ['main', 'products', 'contact'];
        const scrollPos = window.scrollY + 100; // adjust offset for header height
        for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && scrollPos >= el.offsetTop) {
                setActiveSection(sections[i]);
                break;
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="logo">New Looker</div>

            <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                <a
                    className={activeSection === 'main' ? 'active' : ''}
                    onClick={() => scrollTo('main')}
                >
                    Main
                </a>
                <a
                    className={activeSection === 'products' ? 'active' : ''}
                    onClick={() => scrollTo('products')}
                >
                    Products
                </a>
                <a
                    className={activeSection === 'contact' ? 'active' : ''}
                    onClick={() => scrollTo('contact')}
                >
                    Contact
                </a>
            </nav>

            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </header>
    );
};

export default Header;
