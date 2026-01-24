import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ResumeBuilder from './components/ResumeBuilder';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <ResumeBuilder />
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Free AI Resume Builder</h2>
            <p className="text-gray-400 mb-6">
              ATS-Friendly CV Maker Online with Keyword Optimization 2026
            </p>
            <p className="text-sm text-gray-500">
              Built with Cloudflare • Powered by AI • Made for Your Career Success
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
