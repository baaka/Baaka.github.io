import React from 'react';
import Header from './components/Header';
import './index.css';

function App() {
    return (
        <div>
            <Header />

            <main id="main" className="section">
                <h1>Main Section</h1>
                <p>Welcome to the main section of your website.</p>
            </main>

            <section id="products" className="section">
                <h1>Products</h1>
                <p>Here are our amazing products!</p>
            </section>

            <section id="contact" className="section">
                <h1>Contact</h1>
                <p>Contact us at contact@baaka.com</p>
            </section>
        </div>
    );
}

export default App;
