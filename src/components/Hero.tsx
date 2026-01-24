import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Free AI Resume Builder
        </h1>
        <p className="text-xl md:text-2xl mb-4">
          ATS-Friendly CV Maker Online with Keyword Optimization 2026
        </p>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Create professional resumes that pass ATS systems with AI-powered keyword optimization.
          Stand out from the competition and land more interviews.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#builder"
            className="bg-white text-primary font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Start Building Free
          </a>
          <a
            href="#features"
            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
