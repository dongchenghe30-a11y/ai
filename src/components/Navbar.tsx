import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">
              AI Resume Builder
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary transition">
              Features
            </a>
            <a href="#templates" className="text-gray-700 hover:text-primary transition">
              Templates
            </a>
            <a href="#builder" className="text-gray-700 hover:text-primary transition">
              Build Resume
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
