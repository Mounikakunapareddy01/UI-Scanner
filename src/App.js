import React from 'react';
import UIChecker from './UIChecker';
import ErrorBoundary from './ErrorBoundary';
//import ContrastChecker from './ContrastChecker';
import './App.css';

export default function App() {
  return (
    <div className="sample-app">
      {/* Render the scan/checker ONCE, usually outside ErrorBoundary */}
      {/* <ContrastChecker /> */}
      <UIChecker />

      {/* Wrap main sections in ErrorBoundary */}
      <ErrorBoundary>
        <nav className="navbar">
          <span className="logo">ProBrand</span>
          <a href="#services" className="nav-link">Services</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </ErrorBoundary>

      <ErrorBoundary>
        <header className="hero-section">
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=650&q=80" 
            alt="Modern workplace" 
            className="hero-image" 
          />
          <div className="hero-content">
            <h1>Welcome to Your Professional Site</h1>
            <p>We help you deliver modern, accessible, and beautiful web experiences.</p>
            <button className="cta-btn">Get Started</button>
          </div>
        </header>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <main className="main-content">
          <section className="cards-section">
            <div className="card">
              <img src="https://via.placeholder.com/120" alt="Service 1" />
              <h2>Web Development</h2>
              <p>Responsive, fast, and scalable solutions for your business growth.</p>
            </div>
            <div className="card">
              <img src="https://via.placeholder.com/120" alt="Service 2" />
              <h2>UI/UX Design</h2>
              <p>Intuitive interfaces and seamless experiences that wow your users.</p>
            </div>
            <div className="card">
              <img src="https://via.placeholder.com/120" alt="Service 3" />
              <h2>Accessibility</h2>
              <p>Ensure every visitor can access your site—ADA and WCAG compliant!</p>
            </div>
          </section>
          
          <section className="about-section">
            <h2>About Us</h2>
            <p>
              Our team combines technical expertise and design thinking to create web applications that are both functional and engaging.
            </p>
          </section>
        </main>
      </ErrorBoundary>

      <ErrorBoundary>
        <footer className="footer">
          <p>© 2025 ProBrand Solutions &mdash; All rights reserved.</p>
          <nav>
            <a href="#privacy" className="footer-link">Privacy</a>
            <a href="#terms" className="footer-link">Terms</a>
          </nav>
        </footer>
      </ErrorBoundary>
    </div>
  );
}
