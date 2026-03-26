import React from 'react';
import { Navbar } from './Navbar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <footer>
        <div className="container">
          <div className="description">
            <h2>About Puno PlayStore</h2>
            <p>
              Welcome to Puno PlayStore! We provide the best mobile game reviews and downloads. Our site features
              comprehensive reviews, screenshots, and download links for the most popular Android and iOS games.
              Discover new games, read reviews, and download your favorites all in one place.
            </p>
          </div>
          <div className="footBot">
            <p>Copyright 2023-2025 © Puno PlayStore</p>
            <nav>
              <a href="#">About Us</a>
              <a href="#">Privacy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Contact Us</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
