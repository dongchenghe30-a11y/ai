import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Job Description Analysis',
      description: 'Paste any job description and get AI-powered keyword suggestions to optimize your resume for ATS systems.',
    },
    {
      icon: '✨',
      title: 'AI Experience Generator',
      description: 'Turn your bullet points into compelling, professional descriptions that highlight your achievements.',
    },
    {
      icon: '📄',
      title: 'One-Click Resume Generation',
      description: 'Input your information and let our AI create a polished resume in minutes, not hours.',
    },
    {
      icon: '🎨',
      title: 'Multiple Templates',
      description: 'Choose from Modern, Classic, or Creative templates designed for different industries and roles.',
    },
    {
      icon: '📊',
      title: 'ATS Keyword Optimization',
      description: 'Get suggestions on keywords and phrases that will help your resume pass through applicant tracking systems.',
    },
    {
      icon: '💼',
      title: 'Export to PDF & Word',
      description: 'Download your resume in professional formats ready for immediate submission to employers.',
    },
    {
      icon: '🌐',
      title: 'Bilingual Translation',
      description: 'Translate your resume between Chinese and English for international job opportunities.',
    },
    {
      icon: '🔒',
      title: 'Data Privacy',
      description: 'Your data is processed securely. We prioritize your privacy and information security.',
    },
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Your Career Success
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create a standout resume that gets you hired
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
